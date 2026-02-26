import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './providers/database.provider';
import { databaseConnector } from './providers/database-connector';
import { SequenceService } from './services/sequence/sequence.service';
import { BackupService } from './services/backup/backup.service';

const providers = [
  ...databaseProviders,
  ...databaseConnector,
  SequenceService,
  BackupService,
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}
