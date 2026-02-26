import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './guards/jwt.strategy';
import { RedisService } from './services/redis.service';
import { RolesService } from './services/roles.service';
import { UsersService } from './services/users.service';
const providers = [AuthService, JwtStrategy, RedisService, RolesService, UsersService];

@Global()
@Module({
  controllers: [AuthController],
  providers: [...providers],
  exports:[...providers]
})
export class AuthModule {}
