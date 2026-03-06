import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticationGuard } from '../../../../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../auth/guards/authorization.guard';
import { CloudinaryService } from '../services/cloudinary.service';

@Controller('files/cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // destination: './uploads',
        filename: (req, file, callback) => {
          const timestamp = `${new Date().getMilliseconds().toString()}`;

          const uniqueSuffix =
            timestamp + timestamp + '-' + Math.round(Math.random() * 1e9);

          const ext = extname(file.originalname);
          const fileName = `${uniqueSuffix}${ext}`;
          callback(null, fileName);
        },
      }),
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: any,
    @Req() req: any
  ): Promise<any> {
    return this.cloudinaryService.uploadToCloudinary(file, {
      folder: payload.folder,
    });
  }

  @Get('file')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async getfile(@Query('publicId') publicId: string) {
    const response = await this.cloudinaryService.getPrivateFileUrl(publicId);
    return response;
  }
}
