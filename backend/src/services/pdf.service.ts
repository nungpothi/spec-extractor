import path from 'path';
import { promises as fs } from 'fs';
import Mustache from 'mustache';
import puppeteer, { Browser } from 'puppeteer';

export interface PdfGenerationOptions {
  template: string;
  data: Record<string, unknown>;
}

export interface PdfGenerationResult {
  filePath: string;
  fileUrl: string;
}

export class PdfService {
  private readonly templateDirectories: string[];
  private readonly outputDirectory: string;

  constructor() {
    this.templateDirectories = [
      path.resolve(process.cwd(), 'src/templates'),
      path.resolve(__dirname, '../templates'),
    ];
    this.outputDirectory = path.resolve(process.cwd(), '../storage/pdfs');
  }

  private normalizeTemplateName(template: string): string {
    const trimmed = template?.trim();
    if (!trimmed) {
      throw new Error('Template name is required');
    }
    return trimmed.endsWith('.html') ? trimmed : `${trimmed}.html`;
  }

  private async findTemplatePath(template: string): Promise<string> {
    const fileName = this.normalizeTemplateName(template);

    for (const directory of this.templateDirectories) {
      const candidatePath = path.join(directory, fileName);
      try {
        await fs.access(candidatePath);
        return candidatePath;
      } catch {
        // Continue searching other directories
      }
    }

    throw new Error(`Template "${template}" not found`);
  }

  async templateExists(template: string): Promise<boolean> {
    try {
      await this.findTemplatePath(template);
      return true;
    } catch {
      return false;
    }
  }

  private async ensureOutputDirectory(): Promise<void> {
    await fs.mkdir(this.outputDirectory, { recursive: true });
  }

  private buildTimestamp(): string {
    const now = new Date();
    const pad = (value: number) => value.toString().padStart(2, '0');
    return [
      now.getFullYear().toString(),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join('');
  }

  async generate({ template, data }: PdfGenerationOptions): Promise<PdfGenerationResult> {
    const templatePath = await this.findTemplatePath(template);
    const htmlTemplate = await fs.readFile(templatePath, 'utf-8');
    const renderedHtml = Mustache.render(htmlTemplate, data ?? {});

    await this.ensureOutputDirectory();

    const timestamp = this.buildTimestamp();
    const fileName = `${template.replace(/\.html$/, '')}_${timestamp}.pdf`;
    const pdfPath = path.join(this.outputDirectory, fileName);

    let browser: Browser | null = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });
      await page.addStyleTag({
        content: [
          '@page { margin: 0 !important; }',
          'html, body {',
          '  margin: 0 !important;',
          '  padding: 1rem !important;',
          '  background: #ffffff !important;',
          '}'
        ].join('\n'),
      });
      await page.emulateMediaType('screen');

      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '3mm',
          right: '3mm',
          bottom: '3mm',
          left: '3mm',
        },
      });

      await page.close();
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    const fileUrl = `/storage/pdfs/${fileName}`;

    return {
      filePath: pdfPath,
      fileUrl,
    };
  }
}
