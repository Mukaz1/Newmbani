import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../../../../settings/services/settings.service';
import {
  GoogleStorageConfig,
  Settings,
  StorageConfigsServiceJson,
} from '@newmbani/types';

@Injectable()
export class GCSStorageConfigService {
  /**
   * Creates an instance of GCSStorageConfigService.
   * @param {ConfigService} configService
   * @param {SettingsService} settingsService
   * @memberof GCSStorageConfigService
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly settingsService: SettingsService
  ) {}

  async loadConfigFromENV(): Promise<GoogleStorageConfig> {
    return {
      mediaBucket: this.configService.get<string>(
        'GOOGLE_STORAGE_MEDIA_BUCKET'
      ),
      googleAccType: this.configService.get<string>('GOOGLE_ACC_TYPE'),
      googleProjectId: this.configService.get<string>('GOOGLE_PROJECT_ID'),
      googlePrivateKeyID: this.configService.get<string>(
        'GOOGLE_PRIVATE_KEY_ID'
      ),
      googlePrivateKey: this.configService.get<string>('GOOGLE_PRIVATE_KEY'),
      googleClientEmail: this.configService.get<string>('GOOGLE_CLIENT_EMAIL'),
      googleClientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      googleAuthUri: this.configService.get<string>('GOOGLE_AUTH_URI'),
      googleTokenUri: this.configService.get<string>('GOOGLE_TOKEN_URI'),
      googleAuthProviderCertUrl: this.configService.get<string>(
        'GOOGLE_AUTH_PROVIDER_CERT_URL'
      ),
      googleClientCertUrl: this.configService.get<string>(
        'GOOGLE_CLIENT_CERT_URL'
      ),
      googleUniverseDomain: this.configService.get<string>(
        'GOOGLE_UNIVERSE_DOMAIN'
      ),
      googleCredentials: {
        type: this.configService.get<string>('GOOGLE_ACC_TYPE'),
        project_id: this.configService.get<string>('GOOGLE_PROJECT_ID'),
        private_key_id: this.configService.get<string>('GOOGLE_PRIVATE_KEY_ID'),
        private_key: this.configService.get<string>('GOOGLE_PRIVATE_KEY'),
        client_email: this.configService.get<string>('GOOGLE_CLIENT_EMAIL'),
        client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        auth_uri: this.configService.get<string>('GOOGLE_AUTH_URI'),
        token_uri: this.configService.get<string>('GOOGLE_TOKEN_URI'),
        auth_provider_x509_cert_url: this.configService.get<string>(
          'GOOGLE_AUTH_PROVIDER_CERT_URL'
        ),
        client_x509_cert_url: this.configService.get<string>(
          'GOOGLE_CLIENT_CERT_URL'
        ),
      },
    };
  }

  async getStorageConfig(): Promise<GoogleStorageConfig | undefined> {
    const settings: Settings = (await this.settingsService.getSettings({all:true})).data;
    const configFromENV = await this.loadConfigFromENV();

    // get the bucket name
    const bucketName =
      settings &&
      settings.storage &&
      settings.storage.gcs &&
      settings.storage.gcs.bucketName
        ? settings.storage.gcs.bucketName || ''
        : configFromENV.mediaBucket;

    // get the service account
    const serviceAccountString: string | undefined =
      settings && settings.storage && settings.storage.gcs
        ? (settings.storage.gcs.serviceAccount as unknown as string)
        : (JSON.stringify(configFromENV) as unknown as string);
    let serviceAccount: StorageConfigsServiceJson | undefined;

    // Parse the Service Account String
    if (serviceAccountString) {
      serviceAccount =
        serviceAccountString || JSON.parse(serviceAccountString) || undefined;
    } else {
      serviceAccount = undefined;
    }
    if (serviceAccount === undefined) {
      return undefined;
    }

    return {
      mediaBucket: bucketName,
      googleAccType: serviceAccount
        ? serviceAccount.type
        : configFromENV.googleAccType,
      googleProjectId: serviceAccount
        ? serviceAccount.project_id
        : configFromENV.googleProjectId,
      googlePrivateKeyID: serviceAccount
        ? serviceAccount.private_key_id
        : configFromENV.googlePrivateKeyID,
      googlePrivateKey: serviceAccount
        ? serviceAccount.private_key
        : configFromENV.googlePrivateKey,
      googleClientEmail: serviceAccount
        ? serviceAccount.client_email
        : configFromENV.googleClientEmail,
      googleClientId: serviceAccount
        ? serviceAccount.client_id
        : configFromENV.googleClientId,
      googleAuthUri: serviceAccount
        ? serviceAccount.auth_uri
        : configFromENV.googleAuthUri,
      googleTokenUri: serviceAccount
        ? serviceAccount.token_uri
        : configFromENV.googleTokenUri,
      googleAuthProviderCertUrl: serviceAccount
        ? serviceAccount.auth_provider_x509_cert_url
        : configFromENV.googleAuthProviderCertUrl,
      googleClientCertUrl: serviceAccount
        ? serviceAccount.client_x509_cert_url
        : configFromENV.googleClientCertUrl,
      googleUniverseDomain: serviceAccount
        ? serviceAccount.token_uri
        : configFromENV.googleTokenUri,
      googleCredentials: serviceAccount
        ? serviceAccount
        : configFromENV.googleCredentials || {},
    };
  }
}
