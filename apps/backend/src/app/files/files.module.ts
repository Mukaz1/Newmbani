import { Global, Module } from '@nestjs/common';
import { fileManagerProviders } from './providers';
import { CloudinaryModule } from './providers/cloudinary/cloudinary.module';
import { GcsModule } from './providers/gcs/gcs.module';
import { FilesService } from './services/files.service';
import { FilesController } from './controllers/files.controller';
import { FileAutomationService } from './services/automation/file-automation.service';

const providers = [
  ...fileManagerProviders,
];

@Global()
@Module({
  imports: [CloudinaryModule, GcsModule],
  providers: [...providers, FilesService, FileAutomationService],
  exports: [...providers,FilesService, FileAutomationService],
  controllers: [FilesController],
})
export class FilesModule {}
