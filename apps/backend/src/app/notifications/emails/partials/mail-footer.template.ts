import { appName } from '@newmbani/shared';
import { Settings } from '@newmbani/types';

export const mailFooterTemplate = (settings: Settings) => {
  const currentYear = new Date().getFullYear();
  return `
  </div>
  <div
    class="footer"
    style="
      height: fit-content;
      background-color: #f7f7f7;
      padding: 24px 20px 20px 20px;
      color: #222;
      border-top: 1px solid #e4e4e4;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <div class="row" style="max-width: 600px; margin: 0 auto;">
      <p
        style="
          font-size: 15px;
          margin: 0 0 10px 0;
          color: #484848;
        "
      >
        &copy; ${currentYear} ${
          settings.general.company || appName
        }. All rights reserved.
      </p>
      <p
        style="
          font-size: 13px;
          margin: 0 0 10px 0;
          color: #484848;
        "
      >
        You're receiving this email because you have an account with ${
          settings.general.company || appName
        }. 
        For questions or support, visit our 
        <a href="${
          settings.appURL
        }/help" style="color: #008489; text-decoration: underline;">Help Center</a>
        or contact us at 
        <a href="mailto:${settings.mail.auth.user}" style="color: #008489;">${
          settings.mail.auth.user
        }</a>.
      </p>
      <p
        style="
          font-size: 12px;
          margin: 0 0 10px 0;
          color: #767676;
        "
      >
        To manage your email preferences or unsubscribe, 
        <a
          href="${settings.appURL}/account/notifications"
          target="_blank"
          rel="noopener noreferrer"
          style="color: #008489; text-decoration: underline;"
        >click here</a>.
      </p>
      <p
        style="
          font-size: 11px;
          margin: 0;
          color: #b0b0b0;
        "
      >
        Please do not reply to this email. This mailbox is not monitored. <br>
        ${
          settings.general.company || appName
        } is a platform for unique stays and experiences around the world.<br>
        ${settings.general.company || appName}, ${
          settings.general.address || 'Your Company Address'
        }
      </p>
    </div>
  </div>
</main>
</body>
</html>
`;
};
