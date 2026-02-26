import { Global, Module } from '@nestjs/common';
import { SequenceService } from './services/sequence.service';
import { databaseConnector } from './providers/database-connector';
import { databaseProviders } from './providers/database.provider';


const providers = [
  ...databaseProviders,
  ...databaseConnector,
  SequenceService,
];


@Global()
@Module({
  providers: [...providers],
  exports: [...providers],

})
export class DatabaseModule {}
