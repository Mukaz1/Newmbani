import { appName } from '@newmbani/shared';
import { Settings, StorageProvidersEnum } from '@newmbani/types';

export const defaultSettings = (): Settings => {
  return {
    branding: {
      logo: '',
      darkLogo: '',
      favicon: '',
    },
    general: {
      app: appName,
      company: 'Newmbani',
      email: 'info@newmbani.co.ke',
      phone: '+254701663066',
      KRA: 'P89787878H',
      address: {
        boxAddress: '6040',
        town: 'Eldoret',
        building: `Eden Center`,
        street: 'Off Ronald Ngala St',
        country: 'Kenya',
        postalCode: '30100',
      },
    },
    storage: {
      gcs: {
        serviceAccount: {
          type: '',
          project_id: '',
          private_key_id: '',
          private_key: '',
          client_email: '',
          client_id: '',
          auth_uri: '',
          token_uri: '',
          auth_provider_x509_cert_url: '',
          client_x509_cert_url: '',
          universe_domain: '',
        },
        bucketName: '',
      },
      defaultStorageType: StorageProvidersEnum.CLOUDINARY,
    },
    mail: {
      host: 'mail.newmbani.co.ke',
      port: 465,
      auth: {
        user: 'no-reply@newmbani.co.ke',
        pass: 'DJXM0o?z%YoK#t.p',
      },
      from: `${appName} <no-reply@newmbani.co.ke>`,
    },
    appURL: 'http://localhost:4200',
    vatRate: 18,
  };
};
