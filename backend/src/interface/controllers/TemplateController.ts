import { Request, Response } from 'express';
import { TemplateUseCase, CreateTemplateRequest, UpdateTemplateRequest } from '../../usecases/TemplateUseCase';
import { ResponseHelper } from '../helpers/ResponseHelper';

export class TemplateController {
  constructor(private templateUseCase: TemplateUseCase) {}

  // GET /api/template/list
  async getAllTemplates(req: Request, res: Response): Promise<void> {
    try {
      const templates = await this.templateUseCase.getAllTemplates();
      const response = ResponseHelper.success(templates);
      res.status(200).json({ default: response });
    } catch (error) {
      const response = ResponseHelper.error(
        error instanceof Error ? error.message : 'Failed to fetch templates'
      );
      res.status(500).json({ default: response });
    }
  }

  // GET /api/template/:id
  async getTemplateById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const template = await this.templateUseCase.getTemplateById(id);
      
      if (!template) {
        const response = ResponseHelper.error('Template not found');
        res.status(404).json({ default: response });
        return;
      }

      const response = ResponseHelper.success(template);
      res.status(200).json({ default: response });
    } catch (error) {
      const response = ResponseHelper.error(
        error instanceof Error ? error.message : 'Failed to fetch template'
      );
      res.status(400).json({ default: response });
    }
  }

  // POST /api/template/create
  async createTemplate(req: Request, res: Response): Promise<void> {
    try {
      const createRequest: CreateTemplateRequest = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        status: req.body.status || 'active',
        notes: req.body.notes,
        created_by: req.body.created_by
      };

      const template = await this.templateUseCase.createTemplate(createRequest);
      const response = ResponseHelper.created({ id: template.id });
      res.status(201).json({ default: response });
    } catch (error) {
      const response = ResponseHelper.error(
        error instanceof Error ? error.message : 'Failed to create template'
      );
      res.status(400).json({ default: response });
    }
  }

  // PUT /api/template/update/:id
  async updateTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateRequest: UpdateTemplateRequest = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        status: req.body.status,
        notes: req.body.notes,
        updated_by: req.body.updated_by
      };

      const template = await this.templateUseCase.updateTemplate(id, updateRequest);
      
      if (!template) {
        const response = ResponseHelper.error('Template not found');
        res.status(404).json({ default: response });
        return;
      }

      const response = ResponseHelper.updated({});
      res.status(200).json({ default: response });
    } catch (error) {
      const response = ResponseHelper.error(
        error instanceof Error ? error.message : 'Failed to update template'
      );
      res.status(400).json({ default: response });
    }
  }

  // DELETE /api/template/delete/:id
  async deleteTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.templateUseCase.deleteTemplate(id);
      
      if (!success) {
        const response = ResponseHelper.error('Template not found');
        res.status(404).json({ default: response });
        return;
      }

      const response = ResponseHelper.deleted();
      res.status(200).json({ default: response });
    } catch (error) {
      const response = ResponseHelper.error(
        error instanceof Error ? error.message : 'Failed to delete template'
      );
      res.status(400).json({ default: response });
    }
  }
}