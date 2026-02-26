import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateOTPDto } from '../dto/auth/validate-otp.dto';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { AccountVerificationService } from '../services/account-verification.service';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { HttpResponseInterface, UserRequest } from '@newmbani/types';

@ApiTags('Account Verification')
@Controller('auth/account/verification')
export class AccountVerificationController {
  /**
   * Creates an instance of AccountVerificationController.
   * @memberof AccountVerificationController
   * @param accountVerificationService
   */
  constructor(
    private readonly accountVerificationService: AccountVerificationService,
  ) {}

  /**
   * Request Account Verification OTP Code
   *
   * @param {*} req
   * @param res
   * @return {*}
   * @memberof AccountVerificationController
   */
  @Post('request-otp')
  @UseGuards(AuthenticationGuard)
  async requestOTP(
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.accountVerificationService.requestOTP(user);

    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Validate Account Verification OTP Code
   *
   * @param {*} req
   * @param body
   * @param res
   * @return {*}
   * @memberof AccountVerificationController
   */
  @Post('validate-otp')
  @UseGuards(AuthenticationGuard)
  async validateOTP(
    @Req() { user }: UserRequest,
    @Body() body: ValidateOTPDto,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.accountVerificationService.validateOTP({
      user,
      body,
    });

    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
