export interface SendEmail {
  html: { template: string; css: string };
  subject: string;
  recipient: string;
  textAlignment?: 'left' | 'center' | 'right';
  hasHero: boolean;
  attachments?: EmailAttachment[];
  multipart?: object;
  encoding?: string;
}

export interface EmailAttachment {
  filename: string;
  content?: any;
  path?: string;
  encoding?: string;
  contentType: any;
  contentDisposition?: any;
}
