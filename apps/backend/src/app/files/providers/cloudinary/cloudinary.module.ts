import { Global, Module } from '@nestjs/common';
import { CloudinaryController } from './controllers/cloudinary.controller';
import { CloudinaryService } from './services/cloudinary.service';
import { CloudinaryProvider } from './providers/providers';

const providers = [...CloudinaryProvider];

@Global()
@Module({
  providers: [...providers, CloudinaryService],
  controllers: [CloudinaryController],
  exports: [...providers,CloudinaryService],
})
export class CloudinaryModule {}
