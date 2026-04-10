import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  Booking,
  SendEmail,
  Settings,
  SystemEventsEnum,
} from '@newmbani/types';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { SettingsService } from '../../settings/services/settings.service';
import { BookingCancelledLandlordTemplate } from '../emails/booking-cancelled-landlord-template';
import { BookingApprovedLandlordTemplate } from '../emails/booking-approved-landlord-template';
import { BookingApprovedCustomerTemplate } from '../emails/booking-approves-customer-template';
import { BookingCancelledCustomerTemplate } from '../emails/booking-cancelled-customer-template';
import { BookingCreatedCustomerTemplate } from '../emails/booking-create-d-customertemplate';
import { BookingCreatedLandlordTemplate } from '../emails/booking-created-landlord-template';
import { BookingRejectedCustomerTemplate } from '../emails/booking-rejected-customer-template';
import { BookingRejectedLandlordTemplate } from '../emails/booking-rejected-landlord-template';

@Injectable()
export class BookingAutomationService {
  private readonly logger = new Logger(BookingAutomationService.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly settingsService: SettingsService,
  ) {}

  private async getSettings(): Promise<Settings> {
    return (await this.settingsService.getSettings({ all: true })).data;
  }

  // ─────────────────────────────────────────────
  // BOOKING CREATED — notify customer + landlord
  // ─────────────────────────────────────────────
  @OnEvent(SystemEventsEnum.BookingCreated, { async: true })
  async onBookingCreated(booking: Booking): Promise<void> {
    try {
      const settings = await this.getSettings();

      await Promise.all([
        this.notificationsService.dispatchEmail({
          recipient: booking.customer.email,
          subject: `Your Booking for "${booking.property.title}" is Pending`,
          textAlignment: 'left',
          hasHero: false,
          html: BookingCreatedCustomerTemplate(settings, booking),
        } as SendEmail),

        this.notificationsService.dispatchEmail({
          recipient: booking.property.landlord.email,
          subject: `New Booking Request for "${booking.property.title}"`,
          textAlignment: 'left',
          hasHero: false,
          html: BookingCreatedLandlordTemplate(settings, booking),
        } as SendEmail),
      ]);

      this.logger.log(`Booking created emails sent for booking ${booking._id}`);
    } catch (error) {
      this.logger.error(`Error sending booking created emails`, error);
    }
  }

  // ─────────────────────────────────────────────
  // BOOKING APPROVED — notify customer + landlord
  // ─────────────────────────────────────────────
  @OnEvent(SystemEventsEnum.BookingApproved, { async: true })
  async onBookingApproved(booking: Booking): Promise<void> {
    try {
      const settings = await this.getSettings();

      await Promise.all([
        this.notificationsService.dispatchEmail({
          recipient: booking.customer.email,
          subject: `Your Booking for "${booking.property.title}" Has Been Approved`,
          textAlignment: 'left',
          hasHero: false,
          html: BookingApprovedCustomerTemplate(settings, booking),
        } as SendEmail),

        this.notificationsService.dispatchEmail({
          recipient: booking.property.landlord.email,
          subject: `You Approved a Booking for "${booking.property.title}"`,
          textAlignment: 'left',
          hasHero: false,
          html: BookingApprovedLandlordTemplate(settings, booking),
        } as SendEmail),
      ]);

      this.logger.log(`Booking approved emails sent for booking ${booking._id}`);
    } catch (error) {
      this.logger.error(`Error sending booking approved emails`, error);
    }
  }

  // ─────────────────────────────────────────────
  // BOOKING REJECTED — notify customer + landlord
  // ─────────────────────────────────────────────
  @OnEvent(SystemEventsEnum.BookingRejected, { async: true })
  async onBookingRejected(booking: Booking): Promise<void> {
    try {
      const settings = await this.getSettings();

      await Promise.all([
        this.notificationsService.dispatchEmail({
          recipient: booking.customer.email,
          subject: `Your Booking for "${booking.property.title}" Was Not Approved`,
          textAlignment: 'left',
          hasHero: false,
          html: BookingRejectedCustomerTemplate(settings, booking),
        } as SendEmail),

        this.notificationsService.dispatchEmail({
          recipient: booking.property.landlord.email,
          subject: `You Rejected a Booking for "${booking.property.title}"`,
          textAlignment: 'left',
          hasHero: false,
          html: BookingRejectedLandlordTemplate(settings, booking),
        } as SendEmail),
      ]);

      this.logger.log(`Booking rejected emails sent for booking ${booking._id}`);
    } catch (error) {
      this.logger.error(`Error sending booking rejected emails`, error);
    }
  }

  // ─────────────────────────────────────────────
  // BOOKING CANCELLED — notify customer + landlord
  // ─────────────────────────────────────────────
  @OnEvent(SystemEventsEnum.BookingCancelled, { async: true })
  async onBookingCancelled(booking: Booking): Promise<void> {
    try {
      const settings = await this.getSettings();

      await Promise.all([
        this.notificationsService.dispatchEmail({
          recipient: booking.customer.email,
          subject: `Your Booking for "${booking.property.title}" Has Been Cancelled`,
          textAlignment: 'left',
          hasHero: false,
          html: BookingCancelledCustomerTemplate(settings, booking),
        } as SendEmail),

        this.notificationsService.dispatchEmail({
          recipient: booking.property.landlord.email,
          subject: `A Booking for "${booking.property.title}" Was Cancelled`,
          textAlignment: 'left',
          hasHero: false,
          html: BookingCancelledLandlordTemplate(settings, booking),
        } as SendEmail),
      ]);

      this.logger.log(`Booking cancelled emails sent for booking ${booking._id}`);
    } catch (error) {
      this.logger.error(`Error sending booking cancelled emails`, error);
    }
  }
}