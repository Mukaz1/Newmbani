import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  Landlord,
  Property,
  PropertyApprovalStatus,
  SendEmail,
  Settings,
  SystemEventsEnum,
} from '@newmbani/types';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { SettingsService } from '../../settings/services/settings.service';
import { LandlordModel } from '../../landlords/schemas/landlord.schema';
import { PropertyApprovedEmailTemplate } from '../emails/property-approved-template';
import { PropertySubmittedEmailTemplate } from '../emails/property-created-template';
import { PropertyRejectedEmailTemplate } from '../emails/property-rejected-template';

@Injectable()
export class PropertyAutomationService {
  private readonly logger = new Logger(PropertyAutomationService.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly settingsService: SettingsService,
  ) {}

  private async getSettings(): Promise<Settings> {
    return (await this.settingsService.getSettings({ all: true })).data;
  }

  private async getLandlord(landlordId: string): Promise<Landlord | null> {
    return LandlordModel.findById(landlordId).exec();
  }

  /**
   * Sends email to landlord when a property is created and awaiting approval
   */
  @OnEvent(SystemEventsEnum.PropertyCreated, { async: true })
  async onPropertyCreated(property: Property): Promise<void> {
    try {
      const [settings, landlord] = await Promise.all([
        this.getSettings(),
        this.getLandlord(property.landlordId),
      ]);

      if (!landlord) {
        this.logger.warn(`Landlord ${property.landlordId} not found for property ${property._id}`);
        return;
      }

      const mail: SendEmail = {
        recipient: landlord.email,
        subject: `Your Property "${property.title}" is Under Review`,
        textAlignment: 'left',
        hasHero: false,
        html: PropertySubmittedEmailTemplate(settings, landlord, property),
      };

      await this.notificationsService.dispatchEmail(mail);
      this.logger.log(`Property created email sent to landlord ${landlord.email}`);
    } catch (error) {
      this.logger.error(`Error sending property created email`, error);
    }
  }

  /**
   * Sends email to landlord when a property is approved or rejected
   */
  @OnEvent(SystemEventsEnum.PropertyUpdated, { async: true })
  async onPropertyUpdated(property: Property): Promise<void> {
    try {
      const isApproved = property.approvalStatus === PropertyApprovalStatus.APPROVED;
      const isRejected = property.approvalStatus === PropertyApprovalStatus.REJECTED;

      // Only send email on approval status changes
      if (!isApproved && !isRejected) return;

      const [settings, landlord] = await Promise.all([
        this.getSettings(),
        this.getLandlord(property.landlordId),
      ]);

      if (!landlord) {
        this.logger.warn(`Landlord ${property.landlordId} not found for property ${property._id}`);
        return;
      }

      const mail: SendEmail = {
        recipient: landlord.email,
        subject: isApproved
          ? `Your Property "${property.title}" Has Been Approved`
          : `Your Property "${property.title}" Was Not Approved`,
        textAlignment: 'left',
        hasHero: false,
        html: isApproved
          ? PropertyApprovedEmailTemplate(settings, landlord, property)
          : PropertyRejectedEmailTemplate(settings, landlord, property),
      };

      await this.notificationsService.dispatchEmail(mail);
      this.logger.log(`Property ${property.approvalStatus} email sent to landlord ${landlord.email}`);
    } catch (error) {
      this.logger.error(`Error sending property updated email`, error);
    }
  }
}