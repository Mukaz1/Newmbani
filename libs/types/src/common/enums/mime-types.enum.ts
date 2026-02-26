export enum FileMimeType {
    // Images
    JPEG = 'image/jpeg',
    PNG = 'image/png',
    GIF = 'image/gif',
    BMP = 'image/bmp',
    WEBP = 'image/webp',
    SVG = 'image/svg+xml',
    TIFF = 'image/tiff',
    ICO = 'image/x-icon',
  
    // Documents
    PDF = 'application/pdf',
    DOC = 'application/msword',
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLS = 'application/vnd.ms-excel',
    XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PPT = 'application/vnd.ms-powerpoint',
    PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    TXT = 'text/plain',
    CSV = 'text/csv',
    RTF = 'application/rtf',
    ODT = 'application/vnd.oasis.opendocument.text',
  
    // Audio
    MP3 = 'audio/mpeg',
    WAV = 'audio/wav',
    OGG = 'audio/ogg',
    AAC = 'audio/aac',
    FLAC = 'audio/flac',
    M4A = 'audio/mp4',
  
    // Video
    MP4 = 'video/mp4',
    WEBM = 'video/webm',
    OGV = 'video/ogg',
    AVI = 'video/x-msvideo',
    MOV = 'video/quicktime',
    MKV = 'video/x-matroska',
  
    // Archives
    ZIP = 'application/zip',
    RAR = 'application/vnd.rar',
    TAR = 'application/x-tar',
    GZIP = 'application/gzip',
    SEVEN_ZIP = 'application/x-7z-compressed',
  
    // Others
    JSON = 'application/json',
    XML = 'application/xml',
    HTML = 'text/html',
  }
  
  export const FileMimeGroups = {
    Images: [
      FileMimeType.JPEG,
      FileMimeType.PNG,
      FileMimeType.GIF,
      FileMimeType.BMP,
      FileMimeType.WEBP,
      FileMimeType.SVG,
      FileMimeType.TIFF,
      FileMimeType.ICO,
    ],
    PDF:[
      FileMimeType.PDF,
    ],
    Documents: [
      FileMimeType.PDF,
      FileMimeType.DOC,
      FileMimeType.DOCX,
      FileMimeType.XLS,
      FileMimeType.XLSX,
      FileMimeType.PPT,
      FileMimeType.PPTX,
      FileMimeType.TXT,
      FileMimeType.CSV,
      FileMimeType.RTF,
      FileMimeType.ODT,
    ],
    Audio: [
      FileMimeType.MP3,
      FileMimeType.WAV,
      FileMimeType.OGG,
      FileMimeType.AAC,
      FileMimeType.FLAC,
      FileMimeType.M4A,
    ],
    Video: [
      FileMimeType.MP4,
      FileMimeType.WEBM,
      FileMimeType.OGV,
      FileMimeType.AVI,
      FileMimeType.MOV,
      FileMimeType.MKV,
    ],
    Archives: [
      FileMimeType.ZIP,
      FileMimeType.RAR,
      FileMimeType.TAR,
      FileMimeType.GZIP,
      FileMimeType.SEVEN_ZIP,
    ],
    Others: [
      FileMimeType.JSON,
      FileMimeType.XML,
      FileMimeType.HTML,
    ],
  };