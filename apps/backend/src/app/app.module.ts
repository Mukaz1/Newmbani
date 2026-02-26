import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './properties/properties.module';
import { LandlordsModule } from './landlords/landlords.module';
import { TenantsModule } from './tenants/tenants.module';
import { DatabaseModule } from './database/database.module';
import { DefaultModules } from './modules';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [...DefaultModules, PropertiesModule, LandlordsModule, TenantsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [BullModule]
})
export class AppModule {}
