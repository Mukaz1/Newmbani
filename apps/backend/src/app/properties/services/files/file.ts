import { AuditData } from '@newmbani/types';
import { FileTypesEnum } from './enums/file-types.enum';

export interface CreateFileInterface {
  name: string;
  file: object;
  url: string;
}

export interface FileInterface extends CreateFileInterface, AuditData {
  name: string;
  file: object;
  url: string;
}
export interface UploadFile {
  reference: string;
  type: FileTypesEnum;
  documentsUploaded?: boolean;
  comments?: string;
  description?: string;
}
export interface UploadedFileResponse<T = any> {
  metadata: T;
  reference: string;
  userId: string;
}
export interface FileUploadData {
  type: FileTypesEnum;
  fileId: string;
  payload: UploadedFileResponse;
}
export interface FileUploadedRequest {
  type: FileTypesEnum;
  fileName: string;
  data: UploadedFileResponse;
}
