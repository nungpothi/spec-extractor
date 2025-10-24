import { Template } from '../entities/Template';

export interface ITemplateRepository {
  findAll(): Promise<Template[]>;
  findById(id: string): Promise<Template | null>;
  create(template: Partial<Template>): Promise<Template>;
  update(id: string, template: Partial<Template>): Promise<Template | null>;
  delete(id: string): Promise<boolean>;
  findByCategory(category: string): Promise<Template[]>;
  findByStatus(status: string): Promise<Template[]>;
}