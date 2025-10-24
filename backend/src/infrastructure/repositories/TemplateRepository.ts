import { Repository, DataSource } from 'typeorm';
import { Template } from '../../domain/entities/Template';
import { TemplateLog } from '../../domain/entities/TemplateLog';
import { ITemplateRepository } from '../../domain/repositories/ITemplateRepository';

export class TemplateRepository implements ITemplateRepository {
  private templateRepo: Repository<Template>;
  private logRepo: Repository<TemplateLog>;

  constructor(private dataSource: DataSource) {
    this.templateRepo = dataSource.getRepository(Template);
    this.logRepo = dataSource.getRepository(TemplateLog);
  }

  async findAll(): Promise<Template[]> {
    return this.templateRepo.find({
      order: { created_at: 'DESC' }
    });
  }

  async findById(id: string): Promise<Template | null> {
    return this.templateRepo.findOne({ where: { id } });
  }

  async create(templateData: Partial<Template>): Promise<Template> {
    return this.dataSource.transaction(async (manager) => {
      const templateRepo = manager.getRepository(Template);
      const logRepo = manager.getRepository(TemplateLog);

      const template = templateRepo.create(templateData);
      const savedTemplate = await templateRepo.save(template);

      // Create audit log
      const log = TemplateLog.createLog(
        savedTemplate.id,
        'CREATE',
        `Template created: ${savedTemplate.name}`,
        templateData.created_by
      );
      await logRepo.save(log);

      return savedTemplate;
    });
  }

  async update(id: string, templateData: Partial<Template>): Promise<Template | null> {
    return this.dataSource.transaction(async (manager) => {
      const templateRepo = manager.getRepository(Template);
      const logRepo = manager.getRepository(TemplateLog);

      const existingTemplate = await templateRepo.findOne({ where: { id } });
      if (!existingTemplate) {
        return null;
      }

      const updatedTemplate = templateRepo.merge(existingTemplate, templateData);
      const savedTemplate = await templateRepo.save(updatedTemplate);

      // Create audit log
      const log = TemplateLog.createLog(
        savedTemplate.id,
        'UPDATE',
        `Template updated: ${savedTemplate.name}`,
        templateData.updated_by
      );
      await logRepo.save(log);

      return savedTemplate;
    });
  }

  async delete(id: string): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const templateRepo = manager.getRepository(Template);
      const logRepo = manager.getRepository(TemplateLog);

      const template = await templateRepo.findOne({ where: { id } });
      if (!template) {
        return false;
      }

      // Create audit log before deletion
      const log = TemplateLog.createLog(
        template.id,
        'DELETE',
        `Template deleted: ${template.name}`
      );
      await logRepo.save(log);

      const result = await templateRepo.delete(id);
      return result.affected ? result.affected > 0 : false;
    });
  }

  async findByCategory(category: string): Promise<Template[]> {
    return this.templateRepo.find({
      where: { category },
      order: { created_at: 'DESC' }
    });
  }

  async findByStatus(status: string): Promise<Template[]> {
    return this.templateRepo.find({
      where: { status },
      order: { created_at: 'DESC' }
    });
  }
}