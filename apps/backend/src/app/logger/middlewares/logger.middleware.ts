import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { RequestLogHelper } from '../../common/utils/req-log.util';
import { CreateLogDto } from '../dto/log.dto';
import { SystemEventsEnum } from '@newmbani/types';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);

  constructor(
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    //
  }

  async use(request: Request, response: Response, next: NextFunction) {
    const jwtToken: string | null | undefined = request.headers.authorization
      ? request.headers.authorization.split(' ')[1]
      : null;
    const { ip } = RequestLogHelper(request);
    const { method, originalUrl } = request;
    let userId: string | undefined = undefined;
    let email: string | undefined;
    if (jwtToken && !jwtToken.includes('null')) {
      try {
        const query = await this.jwtService.verifyAsync(jwtToken);
        userId = query.sub;
        email = query.email;
      } catch (error) {}

      // if development, log locally in the terminal
      if (process.env.NODE_ENV == 'development') {
        this.logger.log(
          `HTTP request:  ${method} -  ${originalUrl}: ${ip} userId:${userId} ${response.statusCode}`,
        );
      }

      // log in the database
      const log: CreateLogDto = {
        originalReq: request,
        email,
        userId,
        method,
        url: originalUrl,
      };

      this.eventEmitter.emit(SystemEventsEnum.CreateLogEntry, log);
    }
    next();
  }
}
