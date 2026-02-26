import { Settings } from '@newmbani/types';

export const TestEmailTemplate = (data: {
  settings: Settings;
  email: string;
}) => {
  const css = '';
  const template = `
    <p style="font-weight: 500">Welcome to ${data.settings.general.company} online shop</p>
    <p>
     Welcome and this is test email. How are you finding the app so far?
    </p>
    <p style="margin-top: 30px; margin-bottom: 30px">
      <a
        href="${data.settings.appURL}"
        style="
          padding: 8px 20px;
          background-color: #27963a;
          text-decoration: none;
          color: #FFFFFF;
          font-size: 14px;
          border-radius: 5px;
        "
      >
        View Our Shop
      </a>
    </p>
    <p>
      Thank you for your continued dedication to maintaining the highest
      standards of service.
    </p>
    <p style="margin-top: 30px">
      Best regards, <br />
      ${data.settings.general.company} Team
    </p>
  `;
  return { template, css };
};
