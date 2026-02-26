import { Injectable } from '@nestjs/common';
import {
  AccountVerificationCodeOTPDto,
  GeneratePasswordResetOTPDto,
} from '../dto/generate-otp.dto';
import { CustomHttpResponse } from '../../common';
import { OTPModel } from '../schemas/otp.schema';
import { ConfigService } from '@nestjs/config';
import { RedisPrefixEnum } from '../../redis/enums/redis-prefix.enum';
import { RedisService } from '../../redis/services/redis.service';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  OTP,
} from '@newmbani/types';

@Injectable()
export class OtpService {
  constructor(
    private readonly config: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async findById(id: string): Promise<OTP> {
    return await OTPModel.findById(id);
  }

  async generatePasswordResetOTP(data: {
    otp: GeneratePasswordResetOTPDto;
    userId: string;
  }): Promise<OTP> {
    const { otp, userId } = data;
    const payload: any = otp as any;

    payload.createdBy = userId;
    return await OTPModel.create(payload);
  }

  checkIfOTPExpired(otp: OTP): boolean {
    return new Date().getTime() > +otp.expiry;
  }

  async saveAccountVerificationCode(data: {
    otp: AccountVerificationCodeOTPDto;
    userId: string;
  }): Promise<OTP> {
    const { otp, userId } = data;
    const payload: any = otp as any;

    payload.createdBy = userId;
    return await OTPModel.create(payload);
  }

  async findByCode(code: string): Promise<HttpResponseInterface> {
    try {
      const otp: OTP | undefined = await OTPModel.findOne({ code }).exec();

      // check if the otp is not there or if it is there and not active
      if (!otp || (otp && otp.isActive === false)) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'The OTP code invalid',
          data: null,
        });
      }

      // check if expired
      const expired: boolean = this.checkIfOTPExpired(otp);

      if (expired) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'The OTP code invalid',
          data: null,
        });
      }
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'OTP code valid',
        data: otp,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'The OTP code invalid',
        data: null,
      });
    }
  }

  /**
   * Update OTP
   *
   * @param {string} id
   * @param {*} payload
   * @param {string} userId
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof OtpService
   */
  async update(
    id: string,
    payload: any,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };
      payload.updatedBy = userId;
      payload.updatedAt = new Date();
      const res = await OTPModel.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: 'OTP updated successfully!',
        data: res,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: error,
      });
    }
  }

  async setOTPCode(payload: { userId: string; otp: string }): Promise<any> {
    const { userId, otp } = payload;
    // Set otp expiry time
    const expiriesIn = (this.config.get<number>('OTP_EXPIRY') ?? 5) * 60; // minutes
    const prefix = RedisPrefixEnum.OTP_CODE;
    // Set the otp to redis cache
    await this.redisService.setKeyWithExpiry({
      prefix,
      key: userId,
      value: otp,
      expiriesIn,
    });
  }

  async getOTPCode(userId: string): Promise<string | null> {
    try {
      const prefix = RedisPrefixEnum.OTP_CODE;
      // Get the otp from redis cache
      const otp = await this.redisService.get({ prefix, key: userId });
      if (!otp) return null;
      return otp as string;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async invalidateOTPCode(userId: string): Promise<void> {
    try {
      const prefix = RedisPrefixEnum.OTP_CODE;
      // Remove the otp from redis cache
      await this.redisService.delete({ prefix, key: userId });
      return;
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
