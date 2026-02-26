import { Global, Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { logsProviders } from './providers/logs.provider';
import { AuthLogsService } from './services/auth-logs.service';

@Global()
@Module({
  providers: [LoggerService, AuthLogsService, ...logsProviders],
  exports: [LoggerService, AuthLogsService],
})
export class LoggerModule {}
