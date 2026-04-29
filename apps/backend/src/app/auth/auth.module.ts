import { GoogleLoginController } from './controllers/google.controller';
import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { PasswordResetController } from './controllers/password-reset.controller';
import { MagicLoginController } from './controllers/magic-login.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MagicLoginStrategy } from './strategies/magic-login.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleAuthService } from './services/google-auth.service';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { AccountLinksController } from './controllers/account-links.controller';
import { RegisterController } from './controllers/register.controller';
import { AccountVerificationController } from './controllers/account-verification.controller';
import { AccountVerificationService } from './services/account-verification.service';
import { AuthorizationController } from './controllers/authorization.controller';
import { RolesController } from './controllers/roles.controller';
import { LandlordsModule } from '../landlords/landlords.module';
import { AuthorizationGuard } from './guards/authorization.guard';
import { authProviders } from './providers/providers';
import { AuthorizationService } from './services/authorization.service';
import { RolesService } from './services/roles.service';
import { PasswordService } from './services/passwords.service';
import { UserAutomationService } from './services/user-automation.service';
import { UsersService } from './services/users.service';
import { AccountController } from './controllers/account.controller';
import { UsersController } from './controllers/users.controller';
import { CustomersModule } from '../customers/customers.module';
import { BookingsModule } from '../bookings/bookings.module';

@Global()
@Module({
  controllers: [
    AuthController,
    PasswordResetController,
    MagicLoginController,
    GoogleLoginController,
    AccountVerificationController,
    AccountLinksController,
    RegisterController,
    AuthorizationController,
    RolesController,
    UsersController,
    AccountController,
  ],
  imports: [
    LandlordsModule,
    CustomersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('AUTH_TOKEN_EXPIRY') || '12h',
        },
      }),
      inject: [ConfigService],
    }),
    BookingsModule,
  ],
  providers: [
    ...authProviders,
    AuthService,
    JwtStrategy,
    MagicLoginStrategy,
    GoogleAuthService,
    JwtRefreshTokenStrategy,
    AccountVerificationService,
    AuthorizationService,
    AuthorizationGuard,
    UsersService,
    PasswordService,
    UserAutomationService,
    RolesService,
  ],
  exports: [
    ...authProviders,
    AuthService,
    AuthorizationService,
    AuthorizationGuard,
    RolesService,
    UsersService,
    UserAutomationService,
  ],
})
export class AuthModule {}
