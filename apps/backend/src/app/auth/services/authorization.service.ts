/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { DefaultPermissionsData } from '../data/permissions.data';
import { DefaultRolesData } from '../data/default-roles.data';
import {
  CreateRoleDto,
  PostRoleDto,
} from '../dto/authorization/create-role.dto';
import {
  CreateRole,
  DatabaseModelEnums,
  ExpressQuery,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  ModulePermissions,
  Permission,
  PermissionEnum,
  Role,
  SystemEventsEnum,
} from '@newmbani/types';
import { RegisterPermissionDto } from '../dto/authorization/permission.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { CustomHttpResponse } from '../../common';
import { RoleModel } from '../schemas/roles.schema';
import { getRoleParams } from '../utils/getRoleQueryParams.util';
import { AggregateRole } from '../queries/roles.query';
import { PermissionModel } from '../schemas/permissions.schema';
import { camelCaseToWords } from '@newmbani/utils';

@Injectable()
export class AuthorizationService {
  logger = new Logger(AuthorizationService.name);
  /**
   * Creates an instance of AuthorizationService.
   * @param {Model<Role>} roles
   * @param {Model<Permission>} permissions
   * @memberof AuthorizationService
   */
  constructor(
    @Inject(DatabaseModelEnums.ROLE)
    private roles: Model<Role>,
    @Inject(DatabaseModelEnums.PERMISSION)
    private permissions: Model<Permission>,
  ) {
    //
  }

  /**
   *Seed all the permissions
   *
   * @return {*}  {Promise<Permission[]>}
   * @memberof AuthorizationService
   */
  @OnEvent(SystemEventsEnum.SyncSuperUserAccount, { async: true })
  @OnEvent(SystemEventsEnum.SyncDatabase, { async: true })
  async syncPermissions(createdBy?: string): Promise<HttpResponseInterface> {
    try {
      const modulePermissions = ModulePermissions;
      for (const [category, permissions] of Object.entries(modulePermissions)) {
        for (let i = 0; i < permissions.length; i++) {
          const permission = permissions[i];
          // Try to find an existing permission by its name and category
          await PermissionModel.findOneAndUpdate(
            {
              name: permission,
              category: camelCaseToWords(category).toLowerCase(),
            },
            {
              name: permission,
              category: camelCaseToWords(category).toLowerCase(),
            },
            { upsert: true, setDefaultsOnInsert: true },
          ).exec();
        }
      }
      this.logger.log('✅ Permissions have been synced successfully.');

      await this.syncRoles({ userId: createdBy });

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Permissions Synced Successfully',
        data: null,
      });
    } catch (error) {
      // Defensive: ensure error has a message
      const message =
        error && typeof error.message === 'string'
          ? error.message
          : 'Unknown error during permissions sync';
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message,
        data: error,
      });
    }
  }

  /**
   * Create a role
   *
   * @param {CreateRoleDto} data
   * @param {string} userId
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthorizationService
   */
  async createRole(
    data: CreateRoleDto,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const roles = await this.roles.find().exec();
      const _roleFromDB = roles.find((rl: Role) => {
        return rl.name === data.name;
      });

      if (_roleFromDB) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'The role you are trying to create exists',
          data: null,
        });
      } else {
        const payload: PostRoleDto = data as unknown as PostRoleDto;
        payload.createdBy = userId;
        const role = await this.roles.create(payload);
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.CREATED,
          message: 'The role was created successfully!',
          data: role,
        });
      }
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: error,
      });
    }
  }

  /**
   * Update a role using role id
   *
   * @param {string} id
   * @param {Partial<CreateRoleDto>} data
   * @param {string} userId
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthorizationService
   */
  async updateRoleById(
    id: string,
    data: Partial<CreateRoleDto>,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const role = await this.updateRole(id, data, userId);
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Role updated successfully!',
        data: role,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: error,
      });
    }
  }

  /**
   * Sync Roles
   *
   * @param {{ userId: string }} data
   * @return {*}  {Promise<Role[]>}
   * @memberof AuthorizationService
   */
  async syncRoles(data: { userId?: string }): Promise<Role[]> {
    const roles = await this.roles.find().exec();
    const defaultRolesData = DefaultRolesData;

    // Loop through the default roles
    for (let i = 0; i < defaultRolesData.length; i++) {
      const role: CreateRole = defaultRolesData[i];
      const _roleFromDB = roles.find((rl: Role) => {
        return rl.name === role.name;
      });
      // Check if the role exists
      if (_roleFromDB && _roleFromDB._id) {
        // If the role exists and is superAdmin, then update with all the permissions
        const payload: {
          permissions: string[];
          updatedBy: string;
          updatedAt: Date;
        } = {
          permissions: role.permissions,
          updatedBy: data.userId || '',
          updatedAt: new Date(),
        };

        await this.updateRole(_roleFromDB._id, payload);
      } else {
        const payload: PostRoleDto = role as unknown as PostRoleDto;
        payload.createdBy = data.userId || '';
        await this.roles.create(payload);
      }
    }
    return await this.roles.find().exec();
  }

  /**
   * Get all the permissions in the system
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthorizationService
   */
  async getAllPermissions(): Promise<HttpResponseInterface> {
    try {
      const permissions = await this.permissions.find().exec();

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'All Permissions loaded from the database',
        data: permissions,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: error.statusCode,
        message: error.message,
        data: error,
      });
    }
  }

  /**
   * Get all roles in the system
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthorizationService
   */
  async getAllRoles(data: {
    userId?: string;
    query: ExpressQuery;
  }): Promise<HttpResponseInterface> {
    const { userId, query } = data;

    try {
      let roleCount = await RoleModel.countDocuments().exec();
      const defaultRolesData = DefaultRolesData;
      if (roleCount === 0) {
        for (const role of defaultRolesData) {
          const payload: PostRoleDto = role as unknown as PostRoleDto;
          payload.createdBy = userId || null;
          await RoleModel.create(payload);
        }
      }
      roleCount = await RoleModel.countDocuments().exec();

      const queryParams = getRoleParams({
        query,
        totalDocuments: roleCount,
      });
      const pipeline = AggregateRole(queryParams);
      const roles = await RoleModel.aggregate(pipeline).exec();

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'All roles Loaded',
        data: roles,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: error.statusCode,
        message: error.message,
        data: error,
      });
    }
  }

  /**
   * Get role by role id
   *
   * @param {string} roleId
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthorizationService
   */
  async getRoleById(roleId: string): Promise<HttpResponseInterface> {
    try {
      const queryProps = getRoleParams({
        query: { roleId } as unknown as ExpressQuery,
        totalDocuments: 1,
      });
      const pipeline = AggregateRole(queryProps);
      const [role] = await RoleModel.aggregate<Role>(pipeline).exec();
      if (!role) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `Role with ${roleId} not found`,
          data: role,
        });
      }
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Role with ${roleId} found`,
        data: role,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: error.statusCode,
        message: error.message,
        data: error,
      });
    }
  }

  /**
   * Update the role
   *
   * @param {string} id
   * @param {*} data
   * @param {string} [userId]
   * @return {*}  {Promise<any>}
   * @memberof AuthorizationService
   */
  async updateRole(id: string, data: any, userId?: string): Promise<any> {
    const filter = { _id: id };
    const payload: any = data as unknown as any;
    payload.updatedBy = userId;
    payload.updatedAt = new Date();

    // Remove the fields to be updated
    return this.roles.findOneAndUpdate(filter, payload, {
      returnOriginal: false,
    });
  }

  /**
   * Get the roles with a certain permission
   *
   * @param {{ permissions: PermissionEnum[] }} payload
   * @param {string} userId
   * @return {*}  {Promise<string[]>}
   * @memberof AuthorizationService
   */
  async getRolesWithPermissions(
    payload: { permissions: PermissionEnum[] },
    userId: string,
  ): Promise<string[]> {
    const roles =
      (await this.getAllRoles({ userId, query: {} as unknown as ExpressQuery }))
        .data || [];
    const filteredRoles: string[] = [];
    await roles.forEach((role: Role) => {
      const hasPermissions = roles
        .join(',')
        .includes(payload.permissions.join(','));
      if (hasPermissions) {
        filteredRoles.push(role._id.toString());
      }
    });
    return filteredRoles;
  }
}
