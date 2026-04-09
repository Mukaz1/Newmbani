import { Module } from '@nestjs/common';
import { PropertyCategoriesService } from './services/property-categories.service';
import { PropertyCategoriesController } from './controllers/property-categories.controller';
import { PropertiesController } from './controllers/properties.controller';
import { PropertiesService } from './services/properties.service';
import { PropertyImageCategoriesController } from './controllers/property-image-categories.controller';
import { PropertyImagesController } from './controllers/property-images.controller';
import { PropertyImageCategoriesService } from './services/property-image-categories.service';
import { PropertyImagesService } from './services/property-images.service';
import { PropertySubCategoriesController } from './controllers/property-subcategories.controller';
import { PropertySubCategoriesService } from './services/property-subcategories.service';
import { PropertyAutomationService } from './services/property-automation.service';

@Module({
  providers: [
    PropertyCategoriesService,
    PropertiesService,
    PropertyImageCategoriesService,
    PropertyImagesService,
    PropertySubCategoriesService,
    PropertyAutomationService,
  ],
  exports: [
    PropertyCategoriesService,
    PropertiesService,
    PropertyImageCategoriesService,
    PropertyImagesService,
    PropertySubCategoriesService,
  ],
  controllers: [
    PropertyCategoriesController,
    PropertiesController,
    PropertyImageCategoriesController,
    PropertyImagesController,
    PropertySubCategoriesController,
  ],
})
export class PropertiesModule {}
