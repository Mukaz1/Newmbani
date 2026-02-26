import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationService } from '../services/authorization.service';
import { RequiredPermissions } from '../decorators/permissions.decorator';
import { CreateRoleDto } from '../dto/authorization/create-role.dto';
import { UpdateRoleDto } from '../dto/authorization/update-role.dto';
import { AuthorizationGuard } from '../guards/authorization.guard';
import {
  ExpressQuery,
  HttpResponseInterface,
  PermissionEnum,
  UserRequest,
} from '@newmbani/types';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly authorizationService: AuthorizationService) {
    //
  }

  /**
   * Create a role
   *
   * @param {CreateRoleDto} payload
   * @param {*} req
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthorizationController
   */
  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([PermissionEnum.CREATE_ROLE, PermissionEnum.MANAGE_ROLE])
  async createRole(
    @Body() payload: CreateRoleDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    const response: HttpResponseInterface =
      await this.authorizationService.createRole(payload, userId);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get all roles
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthorizationController
   */
  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([PermissionEnum.VIEW_ROLE, PermissionEnum.MANAGE_ROLE])
  async getAllRoles(
    @Req() { user }: UserRequest,
    @Query() query: ExpressQuery,
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    return await this.authorizationService.getAllRoles({ userId, query });
  }

  /**
   * Get role by id
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthorizationController
   */
  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([PermissionEnum.VIEW_ROLE, PermissionEnum.MANAGE_ROLE])
  async getRoleById(@Param('id') id: string): Promise<HttpResponseInterface> {
    return await this.authorizationService.getRoleById(id);
  }

  /**
   * Update a role using role id
   *
   * @param {string} id
   * @param {Partial<UpdateRoleDto>} payload
   * @param {*} req
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthorizationController
   */
  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([PermissionEnum.UPDATE_ROLE, PermissionEnum.MANAGE_ROLE])
  async updateRole(
    @Param('id') id: string,
    @Body() payload: Partial<UpdateRoleDto>,
    @Req() { user }: UserRequest,
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    return await this.authorizationService.updateRoleById(id, payload, userId);
  }
}
