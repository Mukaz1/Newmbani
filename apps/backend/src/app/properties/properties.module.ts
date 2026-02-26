import { Module } from '@nestjs/common';
import { PropertyCategoriesService } from './services/property-categories.service';
import { PropertyCategoriesController } from './controllers/property-categories.controller';
import { PropertiesController } from './controllers/properties.controller';
import { PropertiesService } from './services/properties.service';

@Module({
  providers: [PropertyCategoriesService, PropertiesService],
  exports: [],
  controllers: [PropertyCategoriesController, PropertiesController],
})
export class PropertiesModule {}
