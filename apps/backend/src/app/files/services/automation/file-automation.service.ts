import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import {
  FileTypesEnum,
  FileUploadData,
  FileUploadedRequest,
  Settings,
  StorageProvidersEnum,
  SystemEventsEnum,
} from '@newmbani/types';
import { SettingsService } from '../../../settings/services/settings.service';
import { FilesService } from '../files.service';

@Injectable()
export class FileAutomationService {
  logger = new Logger(FileAutomationService.name);
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly settingsService: SettingsService,
    private readonly fileService: FilesService
  ) {}

  async emitFileUploadedEvents(payload: FileUploadData) {
    const { type } = payload;

    // Attach property image
    if (type === FileTypesEnum.PROPERTY_IMAGE) {
      // Emit event property image uploaded
      this.eventEmitter.emit(SystemEventsEnum.PropertyImageUploaded, payload);
    }

    // Attach logo to the settings
    if (type === FileTypesEnum.COMPANY_LOGO) {
      // Emit event for logo uploaded
      this.eventEmitter.emit(SystemEventsEnum.CompanyLogoUploaded, payload);
    }
    if (type === FileTypesEnum.LANDLORD_DOCUMENT) {
      // Emit event for logo uploaded
      this.eventEmitter.emit(SystemEventsEnum.LandlordDocumentUploaded, payload);
    }
    // TODO: implement listener for host logo uploaded event
    if (type === FileTypesEnum.LANDLORD_LOGO) {
      // Emit event for logo uploaded
      this.eventEmitter.emit(SystemEventsEnum.LandlordLogoUploaded, payload);
    }

    if (type === FileTypesEnum.PROFILE_IMAGE) {
      // Emit event for profile image uploaded
      this.eventEmitter.emit(SystemEventsEnum.FileUploaded, payload);
    }
    if (type === FileTypesEnum.PROFILE_IMAGE) {
      this.eventEmitter.emit(SystemEventsEnum.ProfileImageUploaded, payload);
    }


  }

  @OnEvent(SystemEventsEnum.FileUploaded, { async: true })
  async handleFileUploaded(event: FileUploadedRequest) {
    try {
      const { fileName, data } = event;
      const { metadata, userId } = data;
      const settings: Settings = (
        await this.settingsService.getSettings({ all: true })
      ).data;
      const storage =
        settings.storage.defaultStorageType || StorageProvidersEnum.CLOUDINARY;

      const url =
        storage === StorageProvidersEnum.CLOUDINARY
          ? (metadata.secure_url as string)
          : (metadata.mediaLink as string);
      const payload = {
        name: fileName,
        file: metadata,
        url,
      };
      const response = (
        await this.fileService.createFileEntry({ payload, userId })
      ).data;
      if (!response) return;
      this.logger.log('File entry created successfully!');
      await this.emitFileUploadedEvents({
        payload: data,
        fileId: response._id.toString(),
        type: event.type,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
