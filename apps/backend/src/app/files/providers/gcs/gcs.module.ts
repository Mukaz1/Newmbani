import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GcsController } from './controllers/gcs.controller';
import { GcsService } from './services/gcs.service';
import { GCSStorageConfigService } from './utils/storage.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [GcsService,GCSStorageConfigService],
  controllers: [GcsController],
  exports: [GcsService, GCSStorageConfigService],
})
export class GcsModule {}
