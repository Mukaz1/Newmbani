import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { RefreshTokenDto } from '../dto/auth/refresh-token.dto';
import { SignInDto } from '../dto/auth/sign-in.dto';
import { AuthService } from '../services/auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpResponseInterface, HttpStatusCodeEnum } from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  /**
   * Constructor for AuthController class.
   * @param {AuthService} authService - The authentication service.
   */
  constructor(private readonly authService: AuthService) {
    //
  }

  @Public()
  @ApiResponse({
    status: HttpStatusCodeEnum.OK,
    description: 'The user logged in successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @GenericResponse() res: GenericResponse,
    @Req() req: any,
  ) {
    const response = await this.authService.signIn(signInDto, req);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Refresh the Auth token
   *
   * @param {RefreshTokenDto} refreshTokenDto
   * @param req
   * @return {*}
   * @memberof AuthController
   */
  // @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: any,
  ): Promise<HttpResponseInterface> {
    return this.authService.refreshAccessToken(
      refreshTokenDto.refresh_token,
      req,
    );
  }

  /**
   * Logout does not use {@link AuthenticationGuard}: an expired access token would
   * otherwise return 401 before we can clear Redis. Send `Authorization: Bearer <token>`
   * when available; optional body is not required.
   */
  @Public()
  @Post('logout')
  async invalidateToken(
    @Headers('authorization') authorization?: string,
  ): Promise<HttpResponseInterface> {
    const bearer = authorization?.match(/^Bearer\s+(.+)$/i);
    const token = bearer?.[1]?.trim();
    if (token) {
      await this.authService.invalidateToken(token);
    }
    return {
      data: undefined,
      statusCode: HttpStatusCodeEnum.OK,
      message: 'Token invalidated successfully',
    };
  }
}
