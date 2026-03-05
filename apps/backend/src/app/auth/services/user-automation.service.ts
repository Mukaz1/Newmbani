import { SettingsService } from '../../settings/services/settings.service';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  Tenant,
  ExpressQuery,
  FileUploadData,
  Landlord,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  Role,
  RolesEnum,
  SendEmail,
  Settings,
  StorageProvidersEnum,
  SystemEventsEnum,
  User,
  Address,
} from '@newmbani/types';
import * as _ from 'lodash';
import { ConfigService } from '@nestjs/config';
import { PasswordResetLinkTemplate } from '../emails/password-reset-link.template';
import { PasswordResetOTPTemplate } from '../emails/password-reset-otp.template';
import { PasswordResetSuccessEmailTemplate } from '../emails/password-reset-success.template';
import { generatePasswordResetCode } from '../utils/auto-generate-password-reset-code';
import { AuthorizationService } from './authorization.service';
import { CreateAuthLogDto } from '../../logger/dto/auth-log.dto';
import { SuperUserAccountCreatedEmailTemplate } from '../emails/users/admins/super-user-account-created.template';
import { EmployeeAccountCreatedEmailTemplate } from '../emails/users/employee/account-created.template';
import { CustomHttpResponse } from '../../common';
import { UsersService } from './users.service';
import { appName } from '@newmbani/shared';
import { RegisterEmployeeDto } from '../../employees/dto/register-employee.dto';
import { EmployeeService } from '../../employees/services/employee.service';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { OtpService } from '../../otp/services/otp.service';
import { AccountCreatedLandlordEmailTemplate } from '../../landlords/emails/account-created.template';
import { AccountCreatedTenantEmailTemplate } from '../../tenants/emails/account-created.template';
import { SyncSuperAdminDto } from '../../setup/dto/sync-db.dto';
import { UserModel } from '../schemas/user.schema';
import { TenantModel } from '../../tenants/schemas/tenant.schema';
import { LandlordModel } from '../../landlords/schemas/landlord.schema';

@Injectable()
export class UserAutomationService {
  private logger = new Logger(UserAutomationService.name);

  /**
   * Creates an instance of UserAutomationService.

   * @param {Model<User>} user
   * @param {NotificationsService} notificationsService
   * @param {AuthorizationService} authorizationService
   * @param {UsersService} usersService
   * @param {EventEmitter2} eventEmitter
   * @param {ConfigService} configService
   * @memberof UserAutomationService
   */
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly settingsService: SettingsService,
    private readonly authorizationService: AuthorizationService,
    private readonly otpService: OtpService,
    private readonly usersService: UsersService,
    private readonly employeeService: EmployeeService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {
    //
  }

  /**
   * Send email to landlord on account created
   * @memberof UsersController
   */
  @OnEvent(SystemEventsEnum.UserAccountCreated, { async: true })
  async sendEmailOnUserRegisterEvent(payload: {
    settings: Settings;
    user: User;
  }) {
    const { user, settings } = payload;
    const { landlordId, tenantId } = user;

    const accountType = landlordId
      ? 'Landlord Account'
      : tenantId
        ? 'Tenant Account'
        : 'Employee Account';
    // prepare the payload
    const mail: SendEmail = {
      html: landlordId
        ? AccountCreatedLandlordEmailTemplate(settings, user)
        : AccountCreatedTenantEmailTemplate(settings, user),
      recipient: user.email,
      textAlignment: 'left',
      hasHero: false,
      subject: `${accountType} Created Successfully`,
    };
    await this.notificationsService.dispatchEmail(mail);
  }

  /**
   * Attach password reset code to user when auth log is created
   * @param {CreateAuthLogDto} authLog
   * @returns {Promise<void>}
   * @memberof UserAutomationService
   */
  @OnEvent(SystemEventsEnum.AddAuthLog, { async: true })
  async attachPasswordResetCode(authLog: CreateAuthLogDto): Promise<void> {
    const { userId } = authLog;
    if (userId) {
      // const passwordResetCode: string = generatePasswordResetCode(userId);
      // await this.user
      //   .findOneAndUpdate({ _id: userId }, { passwordResetCode })
      //   .exec();
    }
  }

  /**
   * Send email to new Employee on Account created
   * @memberof UsersController
   */
  @OnEvent(SystemEventsEnum.EmployeeAccountCreated, { async: true })
  async sendEmailOnEmployeeRegisterEvent(payload: {
    settings: Settings;
    user: User;
  }) {
    const { user, settings } = payload;
    const mail: SendEmail = {
      html: EmployeeAccountCreatedEmailTemplate(settings, user),
      recipient: user.email,
      textAlignment: 'left',
      hasHero: false,
      subject: `Welcome to ${appName}!`,
    };
    await this.notificationsService.dispatchEmail(mail);
  }

  /**
   * Update user profile image when profile image is uploaded
   * @param {FileUploadData} payload
   * @memberof UserAutomationService
   */
  @OnEvent(SystemEventsEnum.ProfileImageUploaded, { async: true })
  async updateUserProfileImage(payload: FileUploadData) {
    try {
      const { payload: data, fileId } = payload;
      const { reference: userId, metadata } = data;

      const settings: Settings = (
        await this.settingsService.getSettings({ all: true })
      ).data;
      const storage =
        settings.storage.defaultStorageType || StorageProvidersEnum.CLOUDINARY;

      const profileImageUrl =
        storage === StorageProvidersEnum.CLOUDINARY
          ? (metadata.secure_url as string)
          : (metadata.publicUrl as string);

      await UserModel.findByIdAndUpdate(userId, {
        profileImageUrl,
        profileImageId: fileId,
        updatedAt: new Date(),
      });

      this.logger.log(`Profile image updated for user ${userId}`);
    } catch (error) {
      this.logger.error('Error updating user profile image:', error);
    }
  }

  /**
   * Update user's default address when a default address is set
   * @param payload - Contains userId and address
   * @memberof UserAutomationService
   */
  @OnEvent(SystemEventsEnum.DefaultAddressSet, { async: true })
  async updateUserDefaultAddress(payload: {
    userId: string;
    address: Address;
  }): Promise<void> {
    try {
      const { userId, address } = payload;

      const user = await UserModel.findByIdAndUpdate(userId, {
        defaultAddress: address,
        updatedAt: new Date(),
      });
      await TenantModel.findByIdAndUpdate(user.tenantId, {
        billingAddress: address,
        address: address,
        updatedAt: new Date(),
      });
      await LandlordModel.findByIdAndUpdate(user.landlordId, {
        address: address,
        updatedAt: new Date(),
      });

      this.logger.log(`Default address ${address} set for user ${userId}`);
    } catch (error) {
      this.logger.error('Error updating user default address:', error);
    }
  }

  /**
   * Clear user's default address when the default address is removed
   * @param payload - Contains userId and address
   * @memberof UserAutomationService
   */
  @OnEvent(SystemEventsEnum.DefaultAddressRemoved, { async: true })
  async clearUserDefaultAddress(payload: {
    userId: string;
    address: Address;
  }): Promise<void> {
    try {
      const { userId, address } = payload;

      // Only clear if this was the user's default address
      const user = await UserModel.findById(userId);
      if (user && user.defaultAddress === address) {
        await UserModel.findByIdAndUpdate(userId, {
          defaultAddress: null,
          updatedAt: new Date(),
        });

        this.logger.log(`Default address cleared for user ${userId}`);
      }
      const tenant = await TenantModel.findById(user.tenantId);
      if (tenant && tenant.address === address) {
        await TenantModel.findByIdAndUpdate(user.tenantId, {
          billingAddress: null,
          address: null,
          updatedAt: new Date(),
        });
      }
      const landlord = await LandlordModel.findById(user.landlordId);
      if (landlord && landlord.address === address) {
        await LandlordModel.findByIdAndUpdate(user.landlordId, {
          address: null,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      this.logger.error('Error clearing user default address:', error);
    }
  }

  /**
   * Update user details when tenant is updated
   * @param {Tenant} tenant
   * @memberof UserAutomationService
   */
  @OnEvent(SystemEventsEnum.TenantUpdated, { async: true })
  async syncUserOnTenantUpdate(tenant: Tenant) {
    try {
      if (!tenant._id) return;

      // Find user by tenantId
      const userResponse = await this.usersService.findOne({
        tenantId: tenant._id.toString(),
      });

      if (!userResponse.data) {
        this.logger.warn(`No user found for tenant ${tenant._id}`);
        return;
      }

      const user = userResponse.data;

      // Update user with tenant data
      const updatePayload: Partial<User> = {
        name: tenant.name,
        phone: tenant.phone,
        updatedAt: new Date(),
      };

      await UserModel.findByIdAndUpdate(user._id, updatePayload);

      this.logger.log(`User ${user._id} synced with tenant ${tenant._id}`);
    } catch (error) {
      this.logger.error('Error syncing user on tenant update:', error);
    }
  }

  /**
   * Update user details when landlord is updated
   * @param {Landlord} landlord
   * @memberof UserAutomationService
   */
  @OnEvent(SystemEventsEnum.LandlordUpdated, { async: true })
  async syncUserOnLandlordUpdate(landlord: Landlord) {
    try {
      if (!landlord._id) return;

      // Find user by landlordId
      const userResponse = await this.usersService.findOne({
        landlordId: landlord._id.toString(),
      });

      if (!userResponse.data) {
        this.logger.warn(`No user found for landlord ${landlord._id}`);
        return;
      }

      const user = userResponse.data;

      // Update user with landlord data
      const updatePayload: Partial<User> = {
        name: landlord.name,
        phone: landlord.phone,
        updatedAt: new Date(),
      };

      await UserModel.findByIdAndUpdate(user._id, updatePayload);

      this.logger.log(`User ${user._id} synced with landlord ${landlord._id}`);
    } catch (error) {
      this.logger.error('Error syncing user on landlord update:', error);
    }
  }

  /**
   * Syncs the super admin user account on startup.
   * - Gets the admin role ID.
   * - Generates a random password.
   * - Creates a new employee user with admin role.
   * - Hashes the password.
   * - Checks if email/phone already exists.
   * - Saves the new user.
   * - Emits events to notify of new superuser and sync their DB.
   * - Returns a response.
   */
  async syncAdminUser(
    payload: SyncSuperAdminDto,
  ): Promise<HttpResponseInterface> {
    try {
      // Get the id of the admin role
      const roles: Role[] = (
        await this.authorizationService.getAllRoles({
          query: {} as ExpressQuery,
        })
      ).data;

      if (roles.length > 0) {
        const role: Role = roles.find(
          (ro: Role) => ro.name === RolesEnum.SuperAdminRole,
        );
        console.log('admin role:', role);

        // Get the role ID
        const roleId = role._id.toString();

        // Prepare the employee payload
        const employeeDto: RegisterEmployeeDto = {
          name: payload.name ? payload.name : 'Admin',
          email: payload.email,
          password: payload.password,
          phone: payload.phone,
          roleId,
        };
        console.log('employeeDto:', employeeDto);
        // create a new employee
        const res = await this.employeeService.create({
          newEmployeeDto: employeeDto,
          createdBy: 'system',
        });
        const newUser = res.data;

        console.log('newUser:', newUser);
        if (!newUser) {
          throw new Error('Failed to create new employee');
        }
        // sync database
        this.eventEmitter.emit(
          SystemEventsEnum.SyncDatabase,
          newUser._id.toString(),
        );

        /**
         * Emits a SuperUserAccountCreated event with the settings-wrapper and user data.
         * This notifies other parts of the system that a new superuser account has been created.
         */
        this.eventEmitter.emit(SystemEventsEnum.SuperUserAccountCreated, {
          user: newUser,
        });

        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.CREATED,
          message: `Super User was created successfully!`,
          data: newUser,
        });
      }
    } catch (error) {
      this.logger.error('Error syncing admin user');
      this.logger.error(error);
    }
  }

  /**
   * Listens for the SuperUserAccountCreated system event.
   * Sends an email notification when a new superuser account is created.
   *
   * @param payload - Contains the new superuser account data
   */

  @OnEvent(SystemEventsEnum.SuperUserAccountCreated, { async: true })
  async sendEmailOnSuperUserRegisterEvent(payload: {
    user: RegisterEmployeeDto;
  }) {
    const { user } = payload;
    const mail: SendEmail = {
      html: SuperUserAccountCreatedEmailTemplate(user),
      recipient: user.email,
      textAlignment: 'left',
      hasHero: false,
      subject: `User Account Created Successfully`,
    };
    await this.notificationsService.dispatchEmail(mail);
  }

  @OnEvent(SystemEventsEnum.PasswordResetRequested, { async: true })
  async sendPasswordResetEmail(payload: {
    user: User;
    token: string | null;
    otp: string | null;
  }) {
    const settings = (await this.settingsService.getSettings({ all: true }))
      .data;
    const { user, otp, token } = payload;
    let subject = '';
    let html = { template: '', css: '' };

    // If there is an otp send OTP code else send reset link.
    if (otp) {
      const expiresIn = this.configService.get('OTP_EXPIRY') ?? 5;
      subject = `Your Password Reset OTP is Here`;
      html = PasswordResetOTPTemplate({ settings, user, otp, expiresIn });
    } else {
      const frontendRootURL =
        this.configService.get('FRONTEND_URL') || settings.appURL;
      const resetLink = `${frontendRootURL}/auth/update-password/${token}`;
      subject = `Your Password Reset Link is Here`;
      html = PasswordResetLinkTemplate(settings, user, resetLink);
    }

    const mail: SendEmail = {
      html,
      recipient: user.email,
      textAlignment: 'left',
      hasHero: false,
      subject,
    };

    await this.notificationsService.dispatchEmail(mail);
  }

  /**
   * Send email to user on password reset success
   *
   * @param {User} user
   * @memberof UserAutomationService
   */
  @OnEvent(SystemEventsEnum.PASSWORD_RESET_SUCCESS, { async: true })
  async sendPasswordResetSuccessEmail(user: User) {
    const settings: Settings = (
      await this.settingsService.getSettings({ all: true })
    ).data;

    const mail: SendEmail = {
      html: PasswordResetSuccessEmailTemplate(settings, user),
      recipient: user.email,
      textAlignment: 'left',
      hasHero: false,
      subject: `Your Password was Changed`,
    };

    await this.notificationsService.dispatchEmail(mail);
  }

  @OnEvent(SystemEventsEnum.PASSWORD_RESET_SUCCESS, { async: true })
  @OnEvent(SystemEventsEnum.UserCreated, { async: true })
  @OnEvent(SystemEventsEnum.SuperUserAccountCreated, {
    async: true,
  })
  async setPasswordResetToken(user: User) {
    const passwordResetCode: string = generatePasswordResetCode(user._id);

    await UserModel.findByIdAndUpdate(user._id, {
      passwordResetCode,
    });
  }
}
