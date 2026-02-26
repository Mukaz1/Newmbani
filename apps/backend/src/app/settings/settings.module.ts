import { Global, Module } from '@nestjs/common';
import { SettingsService } from './services/settings.service';
import { settingsProviders } from './settings.provider';
import { SettingsController } from './controllers/settings.controller';

@Global()
@Module({
  providers: [SettingsService, ...settingsProviders],
  exports: [SettingsService, ...settingsProviders],
  controllers: [SettingsController],
})
export class SettingsModule {}
