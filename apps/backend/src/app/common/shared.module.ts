import { Global, Module } from '@nestjs/common';
import { FileGeneratorService } from './services/file-generator.service';
import { QrCodeService } from './services/qrcode.service';
import { BarcodeService } from './services/barcode.service';
import { DatabaseModule } from '../database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [FileGeneratorService, BarcodeService, QrCodeService],
  exports: [FileGeneratorService, BarcodeService, QrCodeService],
  controllers: [],
})
export class SharedModule {}
