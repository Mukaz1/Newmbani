/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'jwt-decode';
import { ExtendedReqDto, SignInDto } from '../dto/auth/sign-in.dto';
import { JwtRefreshTokenStrategy } from '../strategies/jwt-refresh-token.strategy';
import { RedisService } from '../../redis/services/redis.service';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  SystemEventsEnum,
  User,
} from '@newmbani/types';
import { CreateAuthLogDto } from '../../logger/dto/auth-log.dto';
import { CustomHttpResponse } from '../../common';
import { UsersService } from './users.service';
import { ExtendedSocket } from '../../socket.io/types/socket';
import { verify } from 'jsonwebtoken';
import { RolesService } from './roles.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  /**
   * Creates an instance of AuthService.
   * @param {JwtService} jwtService
   * @param {UsersService} usersService
   * @param {RedisService} redisService
   * @param eventEmitter
   * @param configService
   * @memberof AuthService
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly redisService: RedisService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {
    //
  }

  /**
   *Authenticate the user using email and Password
   *
   * @param {SignInDto} signInDto
   * @param req
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthService
   */
  async signIn(signInDto: SignInDto, req: any): Promise<HttpResponseInterface> {
    const payload: ExtendedReqDto = {
      payload: signInDto,
      originalReq: req,
    };
    const user = await this.validateUser(payload);
    return await this.authenticate({ req: { user }, originalReq: req });
  }

  async authenticateViaWhatsapp(phone: string) {
    const user: HttpResponseInterface<User> = await this.usersService.findOne({
      phone,
    });
    if (user.data) {
      return user.data;
    } else {
      // create the user
      return;
    }
  }
  /**
   * Validate the user
   *
   * @return {*}  {Promise<any>}
   * @memberof AuthService
   * @param req
   */
  async validateUser(req: ExtendedReqDto): Promise<User | null> {
    const signInDto: SignInDto = req.payload as SignInDto;
    try {
      const user: User | null = (
        await this.usersService.findOne({
          email: signInDto.email,
          includePassword: true,
        })
      ).data;
      if (user) {
        const passwordConfirmed: boolean = await this.validatePassword({
          password: user.password,
          userPassword: signInDto.password,
        });
        if (!passwordConfirmed) {
          throw new Error('Login Failed. Wrong credentials');
        } else {
          return Promise.resolve(user);
        }
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      // save the logs
      const authLog: CreateAuthLogDto = {
        email: signInDto.email,
        loginSuccess: false,
        originalReq: req.originalReq,
        message: error.message,
      };
      this.eventEmitter.emit(SystemEventsEnum.AddAuthLog, authLog);
      return null;
    }
  }

  /**
   * Authenticate User
   *
   * It takes user from strategy and generates authentication tokens and returns permissions
   *
   * @param {*} res
   * @param originalReq
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof AuthService
   */
  async authenticate(data: {
    req: {
      user: User | null;
      refreshToken?: string;
    };
    originalReq: any;
  }): Promise<HttpResponseInterface> {
    const { req, originalReq } = data;
    try {
      const { user, refreshToken } = req;

      if (!user) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.UNAUTHORIZED,
          message: 'Invalid email or password',
          data: null,
        });
      }
      if (user && !user.isActive) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.UNAUTHORIZED,
          message:
            'Your Account is Suspended. Please contact the system admin for Recovery',
          data: null,
        });
      }
      const { customerId, landlordId } = user;
      const permissions: string[] = user.role.permissions ?? [];

      user.password = undefined;
      user.role.permissions = [...permissions];
      const payload = {
        sub: user._id.toString(),
        email: user.email,
        permissions,
      };

      const access_token = await this.jwtService.signAsync(payload);

      const refresh_token =
        refreshToken ??
        (await this.jwtService.signAsync(payload, {
          expiresIn: '30d',
        }));

      // Store the refresh token in redis
      await this.redisService.saveRefreshToken(user._id, refresh_token);
      delete user.password;

      const data = {
        access_token,
        refresh_token,
        user,
        permissions,
      };

      // save the logs
      const authLog: CreateAuthLogDto = {
        userId: user._id.toString(),
        email: user.email,
        loginSuccess: true,
        originalReq,
      };
      this.eventEmitter.emit(SystemEventsEnum.AddAuthLog, authLog);

      // return the success response
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Hey ${user.name}, You are logged in successfully!`,
        data,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `Login failed, check credentials`,
        data: null,
      });
    }
  }

  /**
   * Refresh the auth token
   *
   * @param {string} refreshToken
   * @param req
   * @return {*}  {Promise<{ access_token: string }>}
   * @memberof AuthService
   */
  async refreshAccessToken(
    refreshToken: string,
    req: any,
  ): Promise<HttpResponseInterface> {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      const valid = await this.redisService.validateRefreshToken(
        decoded.sub,
        refreshToken,
      );
      if (!valid) {
        throw Error('Invalid Refresh token');
      }

      const user: User | null = await (
        await this.usersService.findOne({ email: decoded.else })
      ).data;
      // get the user
      const payload: {
        user: User;
        permissions: string[];
        refreshToken?: string;
      } = {
        refreshToken,
        user,
        permissions: user.role.permissions ?? [],
      };
      // authenticate the user and send back the response
      return this.authenticate({ req: payload, originalReq: req });
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Validate User using Email (Magic Login)
   *
   * @param {string} email
   * @return {*}
   * @memberof AuthService
   */
  async verifyUser(email: string): Promise<User> {
    this.logger.log(`Validating user with email ${email}....`);
    const user: User | null = (await this.usersService.findOne({ email })).data;
    if (!user) {
      throw new UnauthorizedException(
        'An error occurred while authenticating user',
      );
    }
    return user;
  }

  /**
   * Invalidate the user token on logout
   *
   * @param {string} accessToken
   * @return {*}  {Promise<void>}
   * @memberof AuthService
   */
  /**
   * Clears server-side session (e.g. Redis). Uses `ignoreExpiration` so logout works
   * even when the access token is already expired.
   */
  async invalidateToken(accessToken: string): Promise<void> {
    const secret =
      this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ??
      'this-is-a-secret';
    try {
      const decoded = await this.jwtService.verifyAsync<{ sub: string }>(
        accessToken,
        { secret, ignoreExpiration: true },
      );
      if (decoded?.sub) {
        await this.redisService.invalidate(decoded.sub);
      }
    } catch {
      // Malformed or wrong-signature token: nothing to invalidate server-side
      this.logger.warn('Logout: could not verify access token for Redis invalidation');
    }
  }

  /**
   * Validate the user password
   *
   * @param {string} password
   * @param {string} userPassword
   * @return {*}  {Promise<boolean>}
   * @memberof AuthService
   */
  async validatePassword(payload: {
    password: string;
    userPassword: string;
  }): Promise<boolean> {
    const { password, userPassword } = payload;
    const passwordMatch: boolean = await bcrypt.compare(userPassword, password);
    return passwordMatch;
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: JwtPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });

    const userId = payload.sub;

    if (userId) {
      return (await this.usersService.findOne({ userId })).data;
    }
  }

  /**
   *Authenticate client WebSocket
   *
   * @param {ExtendedSocket} client
   * @return {*}  {(Promise<User | null>)}
   * @memberof AuthService
   */
  async authenticateSocket(client: ExtendedSocket): Promise<User | null> {
    try {
      const authorization: string | undefined =
        client.handshake.auth.authorization ||
        client.handshake.headers.authorization;

      let token: string | null = null;
      if (!authorization) {
        return null;
      }
      const tokenArray = authorization.split(' ');
      if (tokenArray.length !== 2) {
        return null;
      }
      token = tokenArray[1];
      const JWT_ACCESS_TOKEN_SECRET =
        process.env.JWT_ACCESS_TOKEN_SECRET || 'this-is-a-secret';

      const payload: JwtPayload = verify(
        token,
        JWT_ACCESS_TOKEN_SECRET,
      ) as JwtPayload;
      return (
        await this.usersService.findOne({
          userId: payload.sub,
        })
      ).data;
    } catch (error) {
      return null;
    }
  }
}
