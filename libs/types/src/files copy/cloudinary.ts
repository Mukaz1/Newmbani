import { UploadApiResponse } from 'cloudinary/types';

export interface CloudinaryFileResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: 'image' | 'video' | 'raw' | 'auto';
  created_at: string;
  tags: Array<string>;
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  publicUrl: string;
  access_mode: string;
  original_filename: string;
  moderation: Array<string>;
  access_control: Array<string>;
  context: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
  metadata: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
  colors?: [string, number][];

}
