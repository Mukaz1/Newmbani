import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  SendEmail,
  User,
} from '@newmbani/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomHttpResponse } from '../../common';
import { ValidateOTPDto } from '../dto/auth/validate-otp.dto';
import { AccountVerificationOTPTemplate } from '../emails/account-verification-otp.template';
import { UsersService } from './users.service';
import { generateOTP } from '../utils/generate-otp-code';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { SettingsService } from '../../settings/services/settings.service';
import { OtpService } from '../../otp/services/otp.service';

@Injectable()
export class AccountVerificationService {
  /**
   * Creates an instance of AccountVerificationService.
   * @param {UsersService} usersService
   * @param {OtpService} otpService
   * @param {SettingsService} settingsService
   * @param {NotificationsService} notificationsService
   * @param {EventEmitter2} eventEmitter
   * @memberof AccountVerificationService
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly settingsService: SettingsService,
    private readonly notificationsService: NotificationsService,
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Generate OTP Code to validate user Account
   *
   * @param {User} user
   * @memberof AuthService
   */
  async requestOTP(user: User): Promise<HttpResponseInterface> {
    try {
      const otp = generateOTP();

      // save otp Code
      await this.otpService.setOTPCode({ userId: user._id.toString(), otp });

      // Send out the notification
      const settings = (await this.settingsService.getSettings({ all: true }))
        .data;
      // get expiry
      const expiresIn = this.config.get('OTP_EXPIRY') ?? 5;
      // prepare the email
      const mail: SendEmail = {
        html: AccountVerificationOTPTemplate({
          settings,
          user,
          otp,
          expiresIn,
        }),
        recipient: user.email,
        hasHero: false,
        subject: `Account Verification Code Generated`,
      };
      this.notificationsService
        .dispatchEmail(mail)
        .then(() => {
          return new CustomHttpResponse({
            statusCode: HttpStatusCodeEnum.OK,
            message: `Hey ${user.name}, Your OTP Code has been sent successfully!`,
            data: null,
          });
        })
        .catch((error) => {
          return new CustomHttpResponse({
            statusCode: HttpStatusCodeEnum.BAD_REQUEST,
            message: `Hey ${user.name}, There was an issue sending your OTP Message`,
            data: error,
          });
        });
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Hey ${user.name}, Your OTP Code has been sent successfully!`,
        data: null,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `Hey ${user.name}, There was an issue sending your OTP Message`,
        data: error,
      });
    }
  }

  /**
   * Validate OTP
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthService
   * @param data
   */
  async validateOTP(data: {
    user: User;
    body: ValidateOTPDto;
  }): Promise<HttpResponseInterface> {
    const { body } = data;
    let { user } = data;
    const { code } = body;
    const serverOTP = await this.otpService.getOTPCode(user._id.toString());

    if (!serverOTP) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'The OTP you have provided is invalid',
        data: null,
      });
    }

    const userId: string = user._id.toString();

    if (serverOTP === code) {
      // Verify user
      user = await (
        await this.usersService.update(
          userId,
          {
            emailVerified: true,
            verified: true,
          },
          userId,
        )
      ).data;

      // Invalidate OTP after use
      await this.otpService.invalidateOTPCode(user._id.toString());

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'You have verified your account successfully',
        data: user,
      });
    } else {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'The OTP you have provided is invalid',
        data: null,
      });
    }
  }
}
