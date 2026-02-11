import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyCategoriesModule } from './property-categories/property-categories.module';
import { PropertiesModule } from './properties/properties.module';

@Module({
  imports: [PropertyCategoriesModule, PropertiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
