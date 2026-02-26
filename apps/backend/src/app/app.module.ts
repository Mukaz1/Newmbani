import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './properties/properties.module';
import { LandlordsModule } from './landlords/landlords.module';
import { TenantsModule } from './tenants/tenants.module';
import { DatabaseModule } from './database/database.module';
import { DefaultModules } from './modules';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { SettingsModule } from './settings/settings.module';
import { LoggerModule } from './logger/logger.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QueuesModule } from './queues/queues.module';
import { SetupModule } from './setup/setup.module';

@Module({
  imports: [
    ...DefaultModules,
    AuthModule,
    PropertiesModule,
    LandlordsModule,
    TenantsModule,
    DatabaseModule,
    SettingsModule,
    LoggerModule,
    NotificationsModule,
    QueuesModule,
    SetupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [BullModule],
})
export class AppModule {}
