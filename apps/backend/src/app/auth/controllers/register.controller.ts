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
import { CreateLandlordDto } from '../../landlords/dtos/landlords.dto';
import { RegisterCustomerDto } from '../../customers/dtos/customer.dto';
import { CustomersService } from '../../customers/services/customers.service';

@Controller('auth/register')
export class RegisterController {
  /**
   * Constructor for RegisterController class.
   * @param {AuthService} authService - The authentication service.
   * @param landlordService
   * @param customersService
   */
  constructor(
    private readonly authService: AuthService,
    private readonly landlordService: LandlordsService,
    private readonly customersService: CustomersService,
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
  ): Promise<HttpResponseInterface> {
    const response = await this.landlordService.createLandlord(landlordDto);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Register an account for a customer
   *
   * @param {RegisterCustomerDto} customerDto
   * @param res
   * @param req
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthController
   */
  @Post('customer')
  async registerClient(
    @Body() customerDto: RegisterCustomerDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    // register the user
    let response = await this.customersService.createCustomer(customerDto);

    // set status code
    res.setStatus(response.statusCode);
    if (response.statusCode !== HttpStatusCodeEnum.CREATED) {
      return response;
    }
    const { email, password } = customerDto;
    const signInDto: SignInDto = {
      email,
      password,
    };
    response = await this.authService.signIn(signInDto, req);
    res.setStatus(response.statusCode);
    return response;
  }
}
