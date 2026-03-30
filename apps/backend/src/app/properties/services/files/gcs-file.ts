export interface GCSFileResponse {
  kind?: string;
  id?: string;
  selfLink?: string;
  publicUrl?: string;
  name: string;
  bucket?: string;
  generation?: string;
  metageneration?: string;
  contentType: string;
  storageClass?: string;
  size: number;
  md5Hash?: string;
  crc32c?: string;
  etag?: string;
  timeCreated: Date;
  updated?: string;
  timeStorageClassUpdated?: string;
  originalName?: string;
  encoding?: string;
  fileName?: string;
}
