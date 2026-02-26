import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequiredPermissions } from '../decorators/permissions.decorator';
import {
  HttpResponseInterface,
  PermissionEnum,
  User,
  UserRequest,
} from '@newmbani/types';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { AuthorizationService } from '../services/authorization.service';

@ApiTags('Authorization')
@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {
    //
  }

  /**
   * Sync the roles and permissions
   *
   * @return {*}  {Promise<Permission[]>}
   * @memberof AuthorizationController
   * @param userId
   */

  @Post('sync-permissions')
  async syncPermissions(userId?: string): Promise<HttpResponseInterface> {
    return await this.authorizationService.syncPermissions(userId);
  }

  /**
   * Get all permissions
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthorizationController
   */
  @Get('permissions')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.VIEW_ROLE)
  async getAllPermissions(): Promise<HttpResponseInterface> {
    return await this.authorizationService.getAllPermissions();
  }

  @Get('roles-with-permissions')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.VIEW_ROLE)
  async getRolesWithPermissions(
    @Body() payload: { permissions: PermissionEnum[] },
    @Req() { user }: UserRequest,
  ) {
    const userId: string = user._id.toString();
    return await this.authorizationService.getRolesWithPermissions(
      payload,
      userId,
    );
  }
}
