import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, User } from '@newmbani/types';
import { UsersService } from '../services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    private readonly usersService: UsersService,
    public readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get('JWT_ACCESS_TOKEN_SECRET') || 'this-is-a-secret',
    });
  }

  /**
   * Validate the user using the payload of the JWT token.
   * @param {JwtPayload} payload - The payload of the JWT token.
   * @return {Promise<any>} - The user if found, otherwise an UnauthorizedException is thrown.
   * @throws {UnauthorizedException} - If the user is not found.
   * @memberof JwtStrategy
   */
  async validate(payload: JwtPayload): Promise<any> {
    const user: User | null = (
      await this.usersService.findOne({
        email: payload.email,
      })
    ).data;
    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException();
    }
    return user;
  }
}
