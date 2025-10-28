import { Request, Response } from 'express';
import { RenderPdfUseCase } from '../../usecases';
import { ApiResponseBuilder } from './ApiResponse';

export class PdfController {
  constructor(private readonly renderPdfUseCase: RenderPdfUseCase) {}

  async render(req: Request, res: Response): Promise<void> {
    try {
      const { template, data } = req.body ?? {};

      if (!template || typeof template !== 'string' || !template.trim()) {
        res.status(400).json({
          default: ApiResponseBuilder.error('template is required'),
        });
        return;
      }

      if (!data || typeof data !== 'object') {
        res.status(400).json({
          default: ApiResponseBuilder.error('data must be an object'),
        });
        return;
      }

      const result = await this.renderPdfUseCase.execute({ template, data });

      res.json({
        default: ApiResponseBuilder.success({ fileUrl: result.fileUrl }, 'pdf_generated'),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate PDF';
      const statusCode = /not found/i.test(message) ? 404 : 500;

      res.status(statusCode).json({
        default: ApiResponseBuilder.error(message),
      });
    }
  }
}
