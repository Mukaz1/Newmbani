import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { defaultSettings } from '../data/settings.data';
import { Model } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import {
  DatabaseModelEnums,
  FileUploadData,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  Settings,
  SystemEventsEnum,
} from '@newmbani/types';
import { UpdateGeneralSettingsDto } from '../dto/update-general-settings.dto';
import { UpdateEmailSettingsDto } from '../dto/update-email-settings.dto';
import { UpdateBrandingSettingsDto } from '../dto/update-branding-settings.dto';
import { CustomHttpResponse } from '../../common';
import { UploadApiResponse } from 'cloudinary/types';

@Injectable()
export class SettingsService implements OnModuleInit {
  private readonly logger = new Logger(SettingsService.name);

  /**
   * Creates an instance of SettingsService.
   * @param {Model<Settings>} settings
   * @memberof SettingsService
   */
  constructor(
    @Inject(DatabaseModelEnums.SETTING)
    private readonly settings: Model<Settings>,
  ) {
    //
  }

  /**
   * Initialize the settings service on Module Init
   * This method is called by NestJS after the module has been initialized
   * and all controllers, providers, etc. have been registered.
   * We use this opportunity to seed the settings data into the database
   * with a default user (null) if no settings are found.
   * @return {Promise<void>}
   * @memberof SettingsService
   */
  async onModuleInit() {
    await this.seed({ userId: null });
  }

  /**
   * Sync Settings to the database
   *
   * @param {string} userId
   * @return {*}
   * @memberof SettingsService
   */
  @OnEvent(SystemEventsEnum.SyncDatabase, { async: true })
  async seed(data: { userId: string; appURL?: string } | string) {
    const settings = await this.settings.find().exec();
    const defaultData = defaultSettings();
    const d: any = data as any;
    let appUrl = defaultData.appURL;
    let userId = d;
    if (Object.prototype.hasOwnProperty.call(data, 'userId')) {
      appUrl = d.appURL ? d.appURL : defaultData.appURL;
      userId = d.userId;
    }

    const payload: Settings = defaultData as any;
    payload.appURL = appUrl ? appUrl : defaultData.appURL;
    payload.createdBy = userId;
    if (settings.length === 0) {
      await this.settings.create(payload);
      this.logger.log('Settings seeded successfully');
    }
  }

  /**
   * Get System Settings
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof SettingsService
   */
  async getSettings(req: {
    all: boolean;
  }): Promise<HttpResponseInterface<Settings>> {
    let data: Settings;
    if (req.all) {
      [data] = await this.settings.find().exec();
    } else {
      [data] = await this.settings
        .aggregate([
          {
            $project: {
              _id: 0,
              __v: 0,
              createdBy: 0,
              createdAt: 0,
              mail: 0,
              storage: 0,
              vatRate: 0,
              appURLs: 0,
              appURL: 0,
            },
          },
          {
            $limit: 1,
          },
        ])
        .exec();
    }

    return new CustomHttpResponse({
      statusCode: HttpStatusCodeEnum.OK,
      message: 'Settings loaded successfully',
      data,
    });
  }

  /**
   * Update General Settings
   *
   * @param {string} id
   * @param {UpdateGeneralSettingsDto} payload
   * @return {*}  {Promise<Settings>}
   * @memberof SettingsService
   */
  async updateGeneralSettings(
    payload: UpdateGeneralSettingsDto,
  ): Promise<HttpResponseInterface> {
    const settings: Settings = (await this.getSettings({ all: true })).data;
    const id = (await this.getSettings({ all: true })).data._id;
    let general = settings.general;
    general = { ...general, ...payload };

    // update the settings
    const updatedSettings = await this.settings
      .findByIdAndUpdate(
        id,
        { general },
        {
          returnOriginal: false,
        },
      )
      .exec();

    return new CustomHttpResponse({
      statusCode: HttpStatusCodeEnum.OK,
      message: 'General settings updated successfully',
      data: updatedSettings,
    });
  }

  /**
   * Update Email Settings
   *
   * @param {string} id
   * @param {UpdateEmailSettingsDto} payload
   * @return {*}  {Promise<Settings>}
   * @memberof SettingsService
   */
  async updateEmailSettings(
    payload: UpdateEmailSettingsDto,
  ): Promise<HttpResponseInterface> {
    const settings: Settings = (await this.getSettings({ all: true })).data;
    const id = (await this.getSettings({ all: true })).data._id;
    let mail = settings.mail;
    mail = { ...mail, ...payload };

    // update the settings
    const updatedSettings = await this.settings
      .findByIdAndUpdate(
        id,
        { mail },
        {
          returnOriginal: false,
        },
      )
      .exec();

    return new CustomHttpResponse({
      statusCode: HttpStatusCodeEnum.OK,
      message: 'Email settings updated successfully',
      data: updatedSettings,
    });
  }

  /**
   * Update Branding Settings
   *
   * @param {string} id
   * @param {UpdateBrandingSettingsDto} payload
   * @return {*}  {Promise<Settings>}
   * @memberof SettingsService
   */
  async updateBrandingSettings(
    payload: UpdateBrandingSettingsDto,
  ): Promise<HttpResponseInterface> {
    const settings: Settings = (await this.getSettings({ all: true })).data;
    const id = (await this.getSettings({ all: true })).data._id;
    let mail = settings.mail;
    mail = { ...mail, ...payload };

    // update the settings
    const updatedSettings = await this.settings
      .findByIdAndUpdate(
        id,
        { mail },
        {
          returnOriginal: false,
        },
      )
      .exec();

    return new CustomHttpResponse({
      statusCode: HttpStatusCodeEnum.OK,
      message: 'Branding settings updated successfully',
      data: updatedSettings,
    });
  }

  @OnEvent(SystemEventsEnum.CompanyLogoUploaded, { async: true })
  async updateCompanyLogo(
    data: FileUploadData,
  ): Promise<HttpResponseInterface<Settings | null>> {
    const settings: Settings = (await this.getSettings({ all: true })).data;
    const { payload } = data;
    const { metadata } = payload;
    const response = metadata as UploadApiResponse;

    if (settings) {
      settings.branding.logo = response.secure_url;
      settings.branding.logoFile = response.metadata;

      const filter = { _id: settings._id };

      await this.settings.findOneAndUpdate(filter, settings, {
        returnOriginal: false,
      });
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'company logo updated successfully',
        data: null,
      });
    }
  }
}
