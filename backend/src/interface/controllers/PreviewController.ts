import { Request, Response } from 'express';
import { PreviewJsonUseCase } from '../../usecases';
import { ApiResponseBuilder } from './ApiResponse';

export class PreviewController {
  constructor(
    private previewJsonUseCase: PreviewJsonUseCase,
  ) {}

  async previewJson(req: Request, res: Response): Promise<void> {
    try {
      const { json_data } = req.body;
      
      if (!json_data) {
        res.status(400).json(ApiResponseBuilder.error('json_data is required'));
        return;
      }

      const result = await this.previewJsonUseCase.execute({ json_data });
      res.json(ApiResponseBuilder.success(result, 'rendered'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to preview JSON';
      res.status(400).json(ApiResponseBuilder.error(message));
    }
  }
}