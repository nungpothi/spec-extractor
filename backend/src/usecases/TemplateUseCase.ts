import { Template } from '../domain/entities/Template';
import { ITemplateRepository } from '../domain/repositories/ITemplateRepository';

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  category: string;
  status: string;
  notes?: string;
  created_by?: string;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  category?: string;
  status?: string;
  notes?: string;
  updated_by?: string;
}

export class TemplateUseCase {
  constructor(private templateRepository: ITemplateRepository) {}

  async getAllTemplates(): Promise<Template[]> {
    return this.templateRepository.findAll();
  }

  async getTemplateById(id: string): Promise<Template | null> {
    if (!id || id.trim().length === 0) {
      throw new Error('Template ID is required');
    }
    return this.templateRepository.findById(id);
  }

  async createTemplate(request: CreateTemplateRequest): Promise<Template> {
    // Business validation
    if (!request.name || request.name.trim().length === 0) {
      throw new Error('Template name is required');
    }

    if (!request.category || request.category.trim().length === 0) {
      throw new Error('Template category is required');
    }

    if (!['active', 'inactive'].includes(request.status)) {
      throw new Error('Invalid status. Must be active or inactive');
    }

    // Create domain entity
    const template = new Template();
    template.updateDetails(
      request.name,
      request.description,
      request.category,
      request.notes
    );
    template.changeStatus(request.status);
    template.created_by = request.created_by;

    return this.templateRepository.create(template);
  }

  async updateTemplate(id: string, request: UpdateTemplateRequest): Promise<Template | null> {
    if (!id || id.trim().length === 0) {
      throw new Error('Template ID is required');
    }

    const existingTemplate = await this.templateRepository.findById(id);
    if (!existingTemplate) {
      throw new Error('Template not found');
    }

    // Apply business logic through domain entity
    if (request.name !== undefined || request.description !== undefined || 
        request.category !== undefined || request.notes !== undefined) {
      existingTemplate.updateDetails(
        request.name || existingTemplate.name,
        request.description !== undefined ? request.description : existingTemplate.description,
        request.category || existingTemplate.category,
        request.notes !== undefined ? request.notes : existingTemplate.notes
      );
    }

    if (request.status) {
      existingTemplate.changeStatus(request.status);
    }

    existingTemplate.updated_by = request.updated_by;

    return this.templateRepository.update(id, existingTemplate);
  }

  async deleteTemplate(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error('Template ID is required');
    }

    const existingTemplate = await this.templateRepository.findById(id);
    if (!existingTemplate) {
      throw new Error('Template not found');
    }

    if (!existingTemplate.canBeDeleted()) {
      throw new Error('Template cannot be deleted in current state');
    }

    return this.templateRepository.delete(id);
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    if (!category || category.trim().length === 0) {
      throw new Error('Category is required');
    }
    return this.templateRepository.findByCategory(category);
  }

  async getTemplatesByStatus(status: string): Promise<Template[]> {
    if (!status || status.trim().length === 0) {
      throw new Error('Status is required');
    }
    return this.templateRepository.findByStatus(status);
  }
}