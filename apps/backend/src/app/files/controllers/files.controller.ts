import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../services/files.service';
import { AuthorizationGuard } from '../../auth/guards/authorization.guard';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { UploadFileDto } from '../dtos/upload-file.dto';
import {
  ExpressQuery,
  FileInterface,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  UserRequest,
} from '@newmbani/types';
import { CustomHttpResponse } from '../../common';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: (req, file, callback) => {
          const prefix = Number(Date.now()).toString(36);
          const ext = extname(file.originalname);
          const fileName = `${file.originalname.split('.')[0]}-${prefix}${ext}`;
          callback(null, fileName);
        },
      }),
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UploadFileDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface<FileInterface>> {
    const userId = user._id.toString();
    const response = await this.fileService.uploadFile({
      file,
      userId,
      payload,
    });
    res.setStatus(response.statusCode);
    return response;
  }

  @Post('multiple')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(
    // Use FilesInterceptor to accept multiple files
    // Optionally, you can set a file limit (e.g., maxCount: 10)
    // and customize storage as needed
    require('multer').FilesInterceptor
      ? require('multer').FilesInterceptor('files', 20, {
          storage: diskStorage({
            filename: (req, file, callback) => {
              const prefix =
                Number(Date.now()).toString(36) +
                '-' +
                Math.round(Math.random() * 1e6).toString(36);
              const ext = extname(file.originalname);
              const baseName = file.originalname.split('.')[0];
              const fileName = `${baseName}-${prefix}${ext}`;
              callback(null, fileName);
            },
          }),
        })
      : require('@nestjs/platform-express').FilesInterceptor('files', 20, {
          storage: diskStorage({
            filename: (req, file, callback) => {
              const prefix =
                Number(Date.now()).toString(36) +
                '-' +
                Math.round(Math.random() * 1e6).toString(36);
              const ext = extname(file.originalname);
              const baseName = file.originalname.split('.')[0];
              const fileName = `${baseName}-${prefix}${ext}`;
              callback(null, fileName);
            },
          }),
        })
  )
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() payload: UploadFileDto,
    @Req() { user }: UserRequest
  ): Promise<CustomHttpResponse> {
    const userId = user._id.toString();
    const data: Array<any> = [];

    if (!files || !Array.isArray(files) || files.length === 0) {
      return new CustomHttpResponse({
        message: 'No files uploaded',
        data: [],
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
      });
    }

    // If payload is an array, match each file to its payload
    // Otherwise, use the same payload for all files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // If payload is an array, use payload[i], else use payload
      const filePayload = Array.isArray(payload) ? payload[i] : payload;
      const result = await this.fileService.uploadFile({
        file,
        userId,
        payload: filePayload,
      });
      data.push(result.data);
    }

    return new CustomHttpResponse({
      message: 'Files Uploaded',
      data,
      statusCode: HttpStatusCodeEnum.CREATED,
    });
  }

  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async getFiles() {
    const response = await this.fileService.getFiles();
    return response;
  }

  @Get(':fileId')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async getFile(
    @GenericResponse() res: GenericResponse,
    @Query() query: ExpressQuery,
    @Param('fileId') fileId: string
  ) {
    const response = await this.fileService.getFile(fileId);
    res.setStatus(response.statusCode);
    return response;
  }
}
