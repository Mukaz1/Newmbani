import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  /**
   *  Uploads file or buffer to cloudinary storage
   * @param input
   * @param options
   */
  async uploadToCloudinary(
    input: Buffer | Express.Multer.File,
    options: {
      public_id?: string;
      folder?: string;
      resource_type?: 'image' | 'video' | 'raw' | 'auto';
      format?: string;
      overwrite?: boolean;
    } = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // Handle buffer input
        if (Buffer.isBuffer(input)) {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: options.resource_type || 'auto',
                public_id: options.public_id,
                folder: options.folder,
                format: options.format,
                overwrite: options.overwrite ?? true,
                access_mode: 'authenticated',
                type: 'authenticated',
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(input);
        }
        // Handle file input
        else {
          const file = input as Express.Multer.File;
          // link should expire in 60 seconds
          const expires = Math.floor(Date.now() / 1000) + 60;
          cloudinary.uploader
            .upload(file.path, {
              resource_type: options.resource_type || 'auto',
              public_id: options.public_id,
              folder: options.folder,
              format: options.format,
              overwrite: options.overwrite ?? true,
              access_mode: 'authenticated',
              type: 'private',
              timestamp: expires,
            })
            .then(resolve)
            .catch(reject);
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  async getFileDetails(publicId: string) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      throw new Error(`Failed to get file details: ${error.message}`);
    }
  }

  async getFileBuffer(publicId: string) {}

  async getPrivateFileUrl(publicId: string): Promise<string> {
    // For private files, generate a signed URL
    return cloudinary.url(publicId, {
      secure: true,
      sign_url: true,
      type: 'authenticated',
    });
  }
}
