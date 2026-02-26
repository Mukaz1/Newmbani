import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodeService {
  async generateQRCode(text: string): Promise<string> {
    try {
      // Generate QR code as base64 string
      return await QRCode.toDataURL(text);
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  async generateQRCodeBuffer(text: string): Promise<Buffer> {
    try {
      // Generate QR code as buffer
      return  await QRCode.toBuffer(text);
    } catch (error) {
      throw new Error(`Failed to generate QR code buffer: ${error.message}`);
    }
  }

  async generateQRCodeSVG(text: string): Promise<string> {
    try {
      // Generate QR code as SVG string
      return  await QRCode.toString(text, { type: 'svg' });
    } catch (error) {
      throw new Error(`Failed to generate QR code SVG: ${error.message}`);
    }
  }
}
