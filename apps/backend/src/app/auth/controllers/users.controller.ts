import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ExpressQuery,
  HttpResponseInterface,
  PermissionEnum,
  User,
  UserRequest,
} from '@newmbani/types';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { RequiredPermissions } from '../decorators/permissions.decorator';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { UsersService } from '../services/users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  /**
   * Creates an instance of UsersController.
   * @param {UsersService} usersService
   * @memberof UsersController
   */
  constructor(private readonly usersService: UsersService) {
    //
  }

  /**
   * Get all users-old who can login to the system
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof UsersController
   */
  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([PermissionEnum.VIEW_USER, PermissionEnum.MANAGE_USERS])
  async getAllUsers(
    @GenericResponse() res: GenericResponse,
    @Query() query: ExpressQuery,
  ): Promise<HttpResponseInterface> {
    const response = this.usersService.findAll(query);
    // set response status code
    res.setStatus((await response).statusCode);
    // return response
    return response;
  }

  /**
   * Get users-old with the role id
   *
   * @param {string} id
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof UsersController
   */
  @Get('role/:id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.VIEW_ROLE,
    PermissionEnum.VIEW_USER,
    PermissionEnum.MANAGE_USERS,
  ])
  async getUsersWithRoleId(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.usersService.findOne({ roleId: id });
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get user by user id
   *
   * @param {string} id
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof UsersController
   */
  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([PermissionEnum.VIEW_USER, PermissionEnum.MANAGE_USERS])
  async getUserById(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.usersService.findOne({ userId: id });
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update user details
   *
   * @param {string} id - User ID to update
   * @param {Partial<User>} payload - User data to update
   * @param {UserRequest} request - Request with authenticated user
   * @param {GenericResponse} res - Response object
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof UsersController
   */
  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.UPDATE_USER,
    PermissionEnum.MANAGE_USERS,
  ])
  async updateUser(
    @Param('id') id: string,
    @Body() payload: Partial<User>,
    @Req() request: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const userId = request.user._id.toString();
    const response = await this.usersService.update(id, payload, userId);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
