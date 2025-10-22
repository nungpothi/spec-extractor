import { Request, Response } from 'express';
import { 
  GetAllSpecificationsUseCase,
  GetSpecificationByIdUseCase,
  CreateSpecificationUseCase,
  DeleteSpecificationUseCase,
} from '../../usecases';
import { ApiResponseBuilder } from './ApiResponse';

export class SpecificationController {
  constructor(
    private getAllSpecificationsUseCase: GetAllSpecificationsUseCase,
    private getSpecificationByIdUseCase: GetSpecificationByIdUseCase,
    private createSpecificationUseCase: CreateSpecificationUseCase,
    private deleteSpecificationUseCase: DeleteSpecificationUseCase,
  ) {}

  async getAllSpecs(req: Request, res: Response): Promise<void> {
    try {
      const specs = await this.getAllSpecificationsUseCase.execute();
      res.json(ApiResponseBuilder.success(specs));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get specifications';
      res.status(500).json(ApiResponseBuilder.error(message));
    }
  }

  async getSpecById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const spec = await this.getSpecificationByIdUseCase.execute(id);
      
      if (!spec) {
        res.status(404).json(ApiResponseBuilder.error('Specification not found'));
        return;
      }

      res.json(ApiResponseBuilder.success(spec));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get specification';
      res.status(500).json(ApiResponseBuilder.error(message));
    }
  }

  async createSpec(req: Request, res: Response): Promise<void> {
    try {
      const { json_data } = req.body;
      
      if (!json_data) {
        res.status(400).json(ApiResponseBuilder.error('json_data is required'));
        return;
      }

      const result = await this.createSpecificationUseCase.execute({
        json_data,
        created_by: req.headers['user-id'] as string,
      });

      res.status(201).json(ApiResponseBuilder.created(result, 'saved'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create specification';
      res.status(400).json(ApiResponseBuilder.error(message));
    }
  }

  async deleteSpec(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteSpecificationUseCase.execute(id);
      res.json(ApiResponseBuilder.deleted());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete specification';
      const status = message.includes('not found') ? 404 : 500;
      res.status(status).json(ApiResponseBuilder.error(message));
    }
  }
}