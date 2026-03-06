import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  FileTypesEnum,
  GCSFileResponse,
  HttpStatusCodeEnum,
  SystemEventsEnum,
  UserRequest,
} from '@newmbani/types';
import { CustomHttpResponse } from '../../../../common';
import { toSentenceCase } from '../../../../common/helpers';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadedFileResponseDto } from '../../../dtos/file-uploaded.dto';
import { UploadFileToGCSDto } from '../dto/upload-file.dto';
import { GcsService } from '../services/gcs.service';
import { Response } from 'express';
import { AuthenticationGuard } from '../../../../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../auth/guards/authorization.guard';

@Controller('files/gcs')
export class GcsController {
  private logger = new Logger(GcsController.name);

  /**
   * Creates an instance of GcsController.
   * @param {EventEmitter2} eventEmitter
   * @param {GcsService} gcsService
   * @memberof GcsController
   */
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly gcsService: GcsService
  ) {}

  /**
   * Upload File to the server for now
   *
   * @param {Express.Multer.File} file
   * @param payload
   * @param user
   * @return {*}
   * @memberof GcsController
   */
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
    @Body() payload: UploadFileToGCSDto,
    @Req() { user }: UserRequest
  ): Promise<any> {
    const userId = user._id.toString();
    // Upload the file to GCP
    const publicUrl = await this.gcsService.uploadFile(file);

    const metadata: GCSFileResponse = {
      name: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      timeCreated: new Date(),
      originalName: file.originalname,
      encoding: file.encoding,
      fileName: file.filename,
      publicUrl,
    };

    // Create the response payload to send alongside the event being emitted
    const responsePayload: UploadedFileResponseDto = {
      metadata,
      reference: payload.reference,
      userId,
    };

    // Attach insurer logo to a host
    if (payload.type === FileTypesEnum.LANDLORD_LOGO) {
      // Emit event for insurer logo uploaded
      this.eventEmitter.emit(
        SystemEventsEnum.LandlordLogoUploaded,
        responsePayload
      );
    }

    // Attach logo to the settings-wrapper
    if (payload.type === FileTypesEnum.COMPANY_LOGO) {
      // Emit event for logo uploaded
      this.eventEmitter.emit(
        SystemEventsEnum.CompanyLogoUploaded,
        responsePayload
      );
    }

    // Attach property image to property
    if (payload.type === FileTypesEnum.PROPERTY_IMAGE) {
      // Emit event for property image uploaded
      this.eventEmitter.emit(
        SystemEventsEnum.PropertyImageUploaded,
        responsePayload
      );
    }

    // Attach property thumbnail to property
    if (payload.type === FileTypesEnum.PROPERTY_THUMBNAIL) {
      // Emit event for property thumbnail uploaded
      this.eventEmitter.emit(
        SystemEventsEnum.PropertyThumbnailUploaded,
        responsePayload
      );
    }

    const fileName = toSentenceCase(payload.type);
    // return the response back to the customer
    return new CustomHttpResponse({
      statusCode: HttpStatusCodeEnum.CREATED,
      message: fileName + ' Uploaded Successfully',
      data: metadata,
    });
  }

  @Get('')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async getAllFiles() {
    return await this.gcsService.getListFiles();
  }

  @Get('signed-url/:fileName')
  async generateSignedUrl(
    @Param('fileName') fileName: string
  ): Promise<{ url: string }> {
    try {
      const url = await this.gcsService.generateSignedUrl(fileName);
      return { url };
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Get('download/:fileName')
  async downloadFile(
    @Param('fileName') fileName: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const buffer = await this.gcsService.getFile(fileName);
      res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(buffer);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Post('upload-multiple')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() payload: UploadFileToGCSDto,
    @Req() { user }: UserRequest
  ): Promise<any> {
    const userId = user._id.toString();

    // Array to marketplace metadata of each uploaded file
    const metadataArray: GCSFileResponse[] = [];

    // Upload each file and push its metadata to the array
    if (files && files.length) {
      for (const file of files) {
        const fileToUpload: any = file;
        fileToUpload.path = file.buffer;
        // Upload the file to GCP
        const publicUrl = await this.gcsService.uploadFileBuffer(fileToUpload);
        const fileName = file.originalname;
        // Create metadata object
        const metadata: GCSFileResponse = {
          name: fileName,
          contentType: file.mimetype,
          size: file.size,
          timeCreated: new Date(),
          originalName: fileName,
          encoding: file.encoding,
          fileName: fileName,
          publicUrl,
        };

        // Push metadata to the array
        metadataArray.push(metadata);
      }
    }
    // Create the response payload to send alongside the event being emitted
    const responsePayload = {
      metadata: metadataArray,
      payload,
      userId,
    };

    // AdministrativeClaimDocumentsEnum
    // return the array of metadata back to the customer
    return new CustomHttpResponse({
      statusCode: HttpStatusCodeEnum.CREATED,
      message: 'Files Uploaded Successfully',
      data: metadataArray,
    });
  }
}
