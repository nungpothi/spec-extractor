import { PdfService } from '../../services/pdf.service';

export interface RenderPdfCommand {
  template: string;
  data: Record<string, unknown>;
}

export interface RenderPdfResult {
  fileUrl: string;
}

export class RenderPdfUseCase {
  constructor(private readonly pdfService: PdfService) {}

  async execute({ template, data }: RenderPdfCommand): Promise<RenderPdfResult> {
    if (!template || typeof template !== 'string' || !template.trim()) {
      throw new Error('template is required');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('data must be an object');
    }

    const templateExists = await this.pdfService.templateExists(template);

    if (!templateExists) {
      throw new Error(`Template "${template}" not found`);
    }

    const { fileUrl } = await this.pdfService.generate({ template, data });

    return { fileUrl };
  }
}
