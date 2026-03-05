import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  User,
} from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { LandlordsService } from '../../landlords/services/landlords.service';
import { SignInDto } from '../dto/auth/sign-in.dto';
import { AuthService } from '../services/auth.service';
import { CreateLandlordDto } from '../../landlords/dtos/lanlords.dto';
import { CreateTenantDto } from '../../tenants/dtos/tenant.dto';
import { TenantsService } from '../../tenants/services/tenants.service';

@Controller('auth/register')
export class RegisterController {
  /**
   * Constructor for RegisterController class.
   * @param {AuthService} authService - The authentication service.
   * @param landlordService
   * @param tenantsService
   */
  constructor(
    private readonly authService: AuthService,
    private readonly landlordService: LandlordsService,
    private readonly tenantsService: TenantsService,
  ) {
    //
  }

  /**
   * Register an account for a landlord
   *
   * @param {RegisterLandlordAccountDto} landlordDto
   * @param res
   * @param req
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthController
   */
  @Post('landlord')
  async registerLandlord(
    @Body() landlordDto: CreateLandlordDto,
    @GenericResponse() res: GenericResponse,
    @Req() user: User,
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    const response = await this.landlordService.createLandlord(
      landlordDto,
      userId,
    );
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Register an account for a tenant
   *
   * @param {CreateTenantDto} tenantDto
   * @param res
   * @param req
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthController
   */
  @Post('tenant')
  async registerClient(
    @Body() tenantDto: CreateTenantDto,
    @GenericResponse() res: GenericResponse,
    @Req() req: any,
  ): Promise<HttpResponseInterface> {
    // register the user
    let response = await this.tenantsService.createTenant(tenantDto);

    // set status code
    res.setStatus(response.statusCode);
    if (response.statusCode !== HttpStatusCodeEnum.CREATED) {
      return response;
    }
    const { email, password } = tenantDto;
    const signInDto: SignInDto = {
      email,
      password,
    };
    response = await this.authService.signIn(signInDto, req);
    res.setStatus(response.statusCode);
    return response;
  }
}
