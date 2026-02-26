import { SharedBullConfigurationFactory } from '@nestjs/bull';
import { QueueOptions } from 'bull';
import * as config from './queues.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueConfigProvider implements SharedBullConfigurationFactory {
  /**
   * Prepare the config for the queues
   *
   * @return {*}  {QueueOptions}
   * @memberof QueueConfigProvider
   */
  createSharedConfiguration(): QueueOptions {
    return config as any;
  }
}
