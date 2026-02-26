import { Injectable } from '@nestjs/common';
import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';

@Injectable()
export class BarcodeService {
  async generateBarcode(payload: {
    data: string;
    format?: string;
    width?: number;
    height?: number;
  }): Promise<string> {
    const { data, format = 'CODE128', width = 1, height = 50 } = payload;

    // Create canvas with appropriate dimensions for barcode
    const canvas = createCanvas(width * 100, height); // Multiply width by 100 to make barcode visible

    try {
      // Generate barcode using JsBarcode
      JsBarcode(canvas, data, {
        format,
        width,
        height,
        displayValue: true, // Show the value below barcode
        margin: 10,
        background: '#ffffff',
        lineColor: '#000000',
        fontSize: 20,
        textMargin: 2,
        textPosition: 'bottom',
        valid: (valid) => {
          if (!valid) {
            throw new Error('Invalid barcode data');
          }
        },
      });

      // Convert canvas to base64 string
      return  canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating barcode:', error);
      throw new Error('Failed to generate barcode');
    }
  }
}
