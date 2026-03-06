import { Injectable } from '@nestjs/common';
import { CustomHttpResponse } from '../../common';
import {
  CloudinaryFileResponse,
  FileInterface,
  FileUploadedRequest,
  GCSFileResponse,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  Settings,
  StorageProvidersEnum,
} from '@newmbani/types';
import { GcsService } from '../providers/gcs/services/gcs.service';
import { CloudinaryService } from '../providers/cloudinary/services/cloudinary.service';
import { SettingsService } from '../../settings/services/settings.service';
import { UploadFileDto } from '../dtos/upload-file.dto';
import { toSentenceCase } from '../../common/helpers';
import { UploadApiResponse } from 'cloudinary/types';
import { UploadedFileResponseDto } from '../dtos/file-uploaded.dto';
import { CreateFileDto } from '../dtos/file.dto';
import { FilesModel } from '../schemas/files.schema';

@Injectable()
export class FilesService {
  constructor(
    private readonly gcsService: GcsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly settingsService: SettingsService
  ) {}

  async uploadFile(data: {
    payload: UploadFileDto;
    file: Express.Multer.File;
    userId: string;
  }): Promise<HttpResponseInterface<FileInterface>> {
    try {
      const { file, payload, userId } = data;
      const settings: Settings = (
        await this.settingsService.getSettings({ all: true })
      ).data;
      const storage =
        settings.storage.defaultStorageType || StorageProvidersEnum.CLOUDINARY;
      //
      if (!file) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: ' No file selected to upload!',
          data: null,
        });
      }

      switch (storage) {
        case StorageProvidersEnum.GOOGLE_CLOUD: {
          const publicUrl = await this.gcsService.uploadFile(file);
          const metadata: GCSFileResponse = {
            name: file.filename,
            contentType: file.mimetype,
            size: file.size,
            timeCreated: new Date(),
            originalName: file.originalname,
            encoding: file.encoding,
            fileName: file.filename,
            publicUrl,
          };

          // Create the response payload to send alongside the event being emitted
          const _data: UploadedFileResponseDto<GCSFileResponse> = {
            metadata,
            reference: payload.reference,
            userId,
          };
          let fileName: string = file.originalname;

          fileName = toSentenceCase(payload.type);
          const requestPayload: FileUploadedRequest = {
            data: _data,
            fileName,
            type: payload.type,
          };
          const response = await this.handleUpload(requestPayload);
          return response;
        }
        case StorageProvidersEnum.CLOUDINARY: {
          // handle cloudinary file upload
          const result: UploadApiResponse =
            await this.cloudinaryService.uploadToCloudinary(file, {
              folder: payload.type,
              public_id: file.filename,
              overwrite: true,
            });
          const _fileName = `${result.original_filename}.${result.format}`;
          const data: UploadedFileResponseDto<CloudinaryFileResponse> = {
            metadata: { ...result, publicUrl: result.secure_url },
            reference: payload.reference,
            userId,
          };
          const requestPayload: FileUploadedRequest = {
            data,
            fileName: _fileName,
            type: payload.type,
          };

          const response = await this.handleUpload(requestPayload);
          return response;
        }

        default:
          return new CustomHttpResponse({
            statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
            message: 'failed to upload file',
            data: null,
          });
      }
    } catch (error) {
      console.log(error);
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null,
      });
    }
  }

  async getFiles() {
    //
    return;
  }

  async createFileEntry(data: {
    payload: CreateFileDto;
    userId: string;
  }): Promise<HttpResponseInterface<FileInterface>> {
    try {
      const { userId, payload } = data;
      const file: FileInterface = await FilesModel.create({
        ...payload,
        createdBy: userId,
        createdAt: new Date(),
      });
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: 'File created successfully',
        data: file,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null,
      });
    }
  }

  async getFile(
    fileId: string
  ): Promise<HttpResponseInterface<FileInterface | null>> {
    try {
      const file: FileInterface = await FilesModel.findById(fileId).exec();
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: 'File fetched successfully',
        data: file,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null,
      });
    }
  }

  async handleUpload(event: FileUploadedRequest) {
    try {
      const { fileName, data } = event;
      const { metadata, userId } = data;
      const settings: Settings = (
        await this.settingsService.getSettings({ all: true })
      ).data;
      const storage =
        settings.storage.defaultStorageType || StorageProvidersEnum.CLOUDINARY;

      const url =
        storage === StorageProvidersEnum.CLOUDINARY
          ? (metadata.secure_url as string)
          : (metadata.mediaLink as string);
      const payload: CreateFileDto = {
        name: fileName,
        file: metadata,
        url,
      };
      const response = (await this.createFileEntry({ payload, userId })).data;
      if (!response) {
        throw new Error('Failed to create file entry after upload.');
      }
      return new CustomHttpResponse({
        data: response,
        message: 'File uploaded and entry created successfully.',
        statusCode: HttpStatusCodeEnum.CREATED,
      });
    } catch (error) {
      console.log('Error handling file uploaded event:', error);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        message:
          error.message || 'An error occurred while handling file upload.',
        data: null,
      });
    }
  }
}
