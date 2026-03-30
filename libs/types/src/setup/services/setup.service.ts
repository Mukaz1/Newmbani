import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ExpressQuery,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  SystemEventsEnum,
  User,
} from '@aluxe/types';
import { AuthorizationService } from '../../auth/services/authorization.service';
import { SettingsService } from '../../settings/services/settings.service';
import { CustomHttpResponse } from '../../common';
import { UserAutomationService } from '../../auth/services/user-automation.service';
import { UsersService } from '../../auth/services/users.service';
import { SyncSuperAdminDto } from '../dto/sync-db.dto';

@Injectable()
export class SetupService {
  private logger = new Logger(SetupService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly authorizationService: AuthorizationService,
    private readonly usersService: UsersService,
    private readonly usersAutomationService: UserAutomationService,
    private readonly settingsService: SettingsService
  ) {
    //
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
   * @param {SyncSuperAdminDto} payload
   * @returns {Promise<HttpResponseInterface>}
   */
  async createSuperUser(
    payload: SyncSuperAdminDto
  ): Promise<HttpResponseInterface> {
    try {
      await this.authorizationService.syncPermissions();
      let appURL: string | null;

      // check if it ends with '/'
      if (payload.appURL && payload.appURL.endsWith('/')) {
        appURL = payload.appURL.substring(0, payload.appURL.length - 1) || null;
      } else {
        appURL = payload.appURL || null;
      }

      // get all the users-old
      const users: User[] | null = (
        await this.usersService.findAll({
          limit: 100000,
        } as unknown as ExpressQuery)
      ).data.data;
      let user: User | null | undefined;
      if (users && users.length > 0) {
        user = users.find((user: User) => {
          return user.email === payload.email;
        });
      } else {
        // create a new user
        user = (await this.usersAutomationService.syncAdminUser(payload)).data;
      }

      if (!user) {
        throw new Error('User not found');
      }
      // sync settings-wrapper
      await this.settingsService.seed({
        userId: user._id.toString(),
        appURL,
      });

      this.eventEmitter.emit(
        SystemEventsEnum.SyncDatabase,
        user._id.toString()
      );

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Super Admin Sync initiated successfully!',
        data: null,
      });
    } catch (error) {
      console.log(error);
      this.logger.error(error);
    }
  }
}
