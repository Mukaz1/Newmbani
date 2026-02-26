import { PasswordService } from '../services/passwords.service';
import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpResponseInterface, PermissionEnum, User } from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import {
  UpdatePasswordDto,
  UpdatePasswordResetDto,
} from '../dto/users/update-password.dto';
import { ResetPasswordDTO } from '../dto/auth/reset-password.dto';
import { RequiredPermissions } from '../decorators/permissions.decorator';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { ValidateTokenDto } from '../dto/auth/validate-token.dto';

@ApiTags('Authentication')
@Controller('auth/password')
export class PasswordResetController {
  /**
   * Creates an instance of PasswordResetController.
   * @param {AuthService} authService
   * @param {UsersService} usersService
   * @memberof PasswordResetController
   */
  constructor(private readonly passwordService: PasswordService) {}

  /**
   * Request a password reset link
   *
   * @param {ResetPasswordDTO} payload
   * @param {GenericResponse} res
   * @return {*}
   * @memberof PasswordResetController
   */
  @Post('reset')
  async requestPasswordReset(
    @Body() payload: ResetPasswordDTO,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.passwordService.requestPasswordReset(payload);
    res.setStatus(response.statusCode);
    return response;
  }

  /** Verify OTP or reset token */
  @Post('reset/verify')
  async verifyReset(
    @Body() payload: ValidateTokenDto,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.passwordService.verifyResetToken(payload);
    res.setStatus(response.statusCode);
    return response;
  }

  /** Confirm password reset using token (link) */
  @Patch('reset/confirm')
  async confirmResetWithToken(
    @Body() payload: UpdatePasswordResetDto,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.passwordService.processPasswordReset(payload);
    res.setStatus(response.statusCode);
    return response;
  }

  /** Update password for logged-in users */
  @Patch('update')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([PermissionEnum.VIEW_USER])
  async updateLoggedInPassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GenericResponse() res: GenericResponse,
    @CurrentUser() user: User,
  ): Promise<HttpResponseInterface> {
    const response =
      await this.passwordService.processUpdatePasswordWhenLoggedIn({
        updatePasswordDto,
        userId: user._id.toString(),
      });
    res.setStatus(response.statusCode);
    return response;
  }
}
