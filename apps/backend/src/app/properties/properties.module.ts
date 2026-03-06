import { Module } from '@nestjs/common';
import { PropertyCategoriesService } from './services/property-categories.service';
import { PropertyCategoriesController } from './controllers/property-categories.controller';
import { PropertiesController } from './controllers/properties.controller';
import { PropertiesService } from './services/properties.service';
import { PropertyImageCategoriesController } from './controllers/property-image-categories.controller';
import { PropertyImagesController } from './controllers/property-images.controller';
import { PropertyImageCategoriesService } from './services/property-image-categories.service';
import { PropertyImagesService } from './services/property-images.service';

@Module({
  providers: [PropertyCategoriesService, PropertiesService, PropertyImageCategoriesService, PropertyImagesService],
  exports: [PropertyCategoriesService, PropertiesService, PropertyImageCategoriesService, PropertyImagesService],
  controllers: [PropertyCategoriesController, PropertiesController, PropertyImageCategoriesController, PropertyImagesController],
})
export class PropertiesModule {}
