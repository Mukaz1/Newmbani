import { Module } from '@nestjs/common';
import { LandlordsService } from './services/landlords.service';
import { LandlordsController } from './controllers/landlords.controller';

@Module({
  providers: [LandlordsService],
  controllers: [LandlordsController],
})
export class LandlordsModule {}
