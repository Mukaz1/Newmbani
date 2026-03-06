import { Injectable } from '@nestjs/common';
import { HttpResponseInterface, HttpStatusCodeEnum, SystemEventsEnum } from '@newmbani/types';
import { CustomHttpResponse } from './common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AppService {

  constructor(private eventEmitter: EventEmitter2) { }


  getData(): { message: string } {
    return { message: 'Hello API' };
  }


  syncSystem(userId: string): HttpResponseInterface<null> {
    this.eventEmitter.emit(SystemEventsEnum.Sync, userId);
    this.eventEmitter.emit(SystemEventsEnum.SyncDatabase, userId);

    return new CustomHttpResponse({
      statusCode: HttpStatusCodeEnum.OK,
      message: 'Database Sync initiated successfully!',
      data: null,
    });
  }

}
