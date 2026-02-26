import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileGeneratorService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Generates a PDF from HTML.
   * @param html - The HTML to generate a PDF from.
   * @returns A buffer containing the PDF.
   */
  async generatePDF(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 0,
      args: ['--no-sandbox', '--disable-gpu'],
      executablePath:
        this.configService.get('NODE_ENV') === 'production'
          ? '/usr/bin/chromium-browser'
          : JSON.parse(this.configService.get('APP_DOCKERIZED')) === true
          ? '/usr/bin/chromium-browser'
          : puppeteer.executablePath(),
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    const pdfArray = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return Buffer.from(pdfArray);
  }
}
