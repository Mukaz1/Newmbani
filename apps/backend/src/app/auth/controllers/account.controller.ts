import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ManageMagicLoginDto } from '../dto/users/update-magic-login.dto';
import { DefaultAddressDto } from '../dto/users/update-shipping-address.dto';
import { HttpResponseInterface, UserRequest } from '@newmbani/types';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { AuthLogsService } from '../../logger/services/auth-logs.service';

@Controller('account')
export class AccountController {
  /**
   * Creates an instance of AccountController.
   * @param {UsersService} usersService
   * @param {AuthLogsService} authLogsService
   * @memberof AccountController
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly authLogsService: AuthLogsService,
  ) {
    //
  }

  /**
   * Get user account for the logged in user
   *
   * @param {*} req
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof UsersController
   */
  @Get('')
  @UseGuards(AuthenticationGuard)
  async getMyAccount(
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const { email } = user;
    // get user account
    const response = await this.usersService.findOne({ email });
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update magic link status
   *
   * @param {*} req
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof UsersController
   */
  @Patch('magic-login')
  @UseGuards(AuthenticationGuard)
  async updateMagicLogin(
    @Req() { user }: UserRequest,
    @Body() body: ManageMagicLoginDto,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const { _id } = user;
    // update magic login status
    const response = await this.usersService.manageMagicLogin(_id, body, _id);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update magic link status
   *
   * @param {*} req
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof UsersController
   */
  @Patch('shipping-address')
  @UseGuards(AuthenticationGuard)
  async updateDefaultAddress(
    @Req() { user }: UserRequest,
    @Body() body: DefaultAddressDto,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const { _id } = user;
    // update shipping address
    const response = await this.usersService.updateAddress(_id, body, _id);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  @Get('auth-logs')
  @UseGuards(AuthenticationGuard)
  async getMyAuthLogs(
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const { email } = user;
    const payload: { email } = { email };
    // get user account
    const response = await this.authLogsService.getAllAuthLogs(payload);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
