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
      email: 'mukazion@gmail.com',
      phone: '+254793039963',
      KRA: '',
      address: {
        boxAddress: '6040',
        town: 'Kapsabet',
        building: `Baraton`,
        street: 'Baraton Center',
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
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      },
      from: `${appName} <mukazion@gmail.com>`,
    },
    appURL: 'http://localhost:4200',
    vatRate: 18,
  };
};
