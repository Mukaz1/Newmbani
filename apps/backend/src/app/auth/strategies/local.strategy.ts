import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
    this.logger.warn('LocalStrategy initialized');
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({
      originalReq: { ip: '0.0.0.0' },
      payload: { email, password },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
