import { Module } from '@nestjs/common';
import { PropertyCategoriesService } from './services/property-categories.service';

@Module({
  providers: [PropertyCategoriesService],
})
export class PropertyCategoriesModule {}
