import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../../settings/services/settings.service';
import { MagicLoginPayload, SendEmail, User } from '@newmbani/types';
import { UsersService } from '../services/users.service';
import { MagicLoginLinkTemplate } from '../emails/magic-link.template';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  /**
   *
   */
  constructor(
    private usersService: UsersService,
    notificationService: NotificationsService,
    private readonly settingsService: SettingsService,
    configService: ConfigService,
  ) {
    super({
      secret:
        configService.get('JWT_ACCESS_TOKEN_SECRET') || 'this-is-a-secret', // get this from env vars
      jwtOptions: {
        expiresIn: configService.get('MAGIC_LOGIN_EXPIRY') || '5m',
      },
      callbackUrl: `${configService.get(
        'FRONTEND_URL',
      )}/auth/passwordless/callback`,
      sendMagicLink: async (destination: string, href: string) => {
        const settings = (await this.settingsService.getSettings({ all: true }))
          .data;
        const user: User | null = (
          await this.usersService.findOne({ email: destination })
        ).data;
        if (!user) {
          throw new Error('The user is not found');
        }
        // send the email to the user
        const mail: SendEmail = {
          subject: 'Magic Login Link',
          recipient: destination,
          textAlignment: 'left',
          hasHero: false,
          html: MagicLoginLinkTemplate(
            settings,
            { name: user.name, email: destination },
            href,
          ),
        };
        await notificationService.dispatchEmail(mail);
      },
      verify: async (
        payload: MagicLoginPayload,
        callback: (arg0: null, arg1: Promise<any>) => any,
      ) => {
        return callback(null, this.validate(payload));
      },
    });
  }

  async validate(payload: MagicLoginPayload) {
    const user: User | null = (
      await this.usersService.findOne({ email: payload.destination })
    ).data;
    if (!user) {
      return null;
    }
    return user;
  }
}
