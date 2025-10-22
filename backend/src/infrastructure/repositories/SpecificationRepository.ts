import { Repository } from 'typeorm';
import { ISpecificationRepository, Specification } from '../../domain';
import { SpecificationEntity } from '../database/entities';
import { AppDataSource } from '../database/dataSource';

export class SpecificationRepository implements ISpecificationRepository {
  private repository: Repository<SpecificationEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(SpecificationEntity);
  }

  async findAll(): Promise<Specification[]> {
    const entities = await this.repository.find({
      order: { created_at: 'DESC' },
    });

    return entities.map(entity => this.toDomain(entity));
  }

  async findById(id: string): Promise<Specification | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async save(specification: Specification): Promise<Specification> {
    const entity = this.toEntity(specification);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  private toDomain(entity: SpecificationEntity): Specification {
    return new Specification(
      entity.id,
      entity.summary,
      entity.json_data,
      entity.preview_html,
      entity.created_at,
      entity.created_by,
      entity.updated_at,
      entity.updated_by,
    );
  }

  private toEntity(specification: Specification): SpecificationEntity {
    const entity = new SpecificationEntity();
    entity.id = specification.id;
    entity.summary = specification.summary;
    entity.json_data = specification.jsonData;
    entity.preview_html = specification.previewHtml;
    entity.created_at = specification.createdAt;
    entity.created_by = specification.createdBy;
    if (specification.updatedAt) {
      entity.updated_at = specification.updatedAt;
    }
    entity.updated_by = specification.updatedBy;
    return entity;
  }
}