import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthService } from '../services/google-auth.service';

@ApiTags('Authentication')
@Controller('auth/google')
export class GoogleLoginController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  // @Get('')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() _req) {
  //   //
  // }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req) {
    return this.googleAuthService.googleLogin(req);
  }
}
