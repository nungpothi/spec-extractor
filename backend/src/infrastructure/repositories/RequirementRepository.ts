import { Repository } from 'typeorm';
import { IRequirementRepository } from '../../domain/repositories';
import { Requirement, RequirementStatus } from '../../domain/entities';
import { RequirementEntity } from '../database/entities';
import { AppDataSource } from '../database/dataSource';

export class RequirementRepository implements IRequirementRepository {
  private repository: Repository<RequirementEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(RequirementEntity);
  }

  async findAll(): Promise<Requirement[]> {
    const entities = await this.repository.find({
      order: { created_at: 'DESC' },
    });

    return entities.map(entity => this.mapToEntity(entity));
  }

  async findByUserId(userId: string): Promise<Requirement[]> {
    const entities = await this.repository.find({
      where: { created_by: userId },
      order: { created_at: 'DESC' },
    });

    return entities.map(entity => this.mapToEntity(entity));
  }

  async findPublicRequirements(): Promise<Requirement[]> {
    const entities = await this.repository.find({
      where: { is_private: false },
      order: { created_at: 'DESC' },
    });

    return entities.map(entity => this.mapToEntity(entity));
  }

  async findByUserOrPublic(userId: string): Promise<Requirement[]> {
    const entities = await this.repository
      .createQueryBuilder('requirement')
      .where('requirement.created_by = :userId', { userId })
      .orWhere('requirement.is_private = false')
      .orderBy('requirement.created_at', 'DESC')
      .getMany();

    return entities.map(entity => this.mapToEntity(entity));
  }

  async findById(id: string): Promise<Requirement | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return this.mapToEntity(entity);
  }

  async save(requirement: Requirement): Promise<Requirement> {
    const entity = this.mapToDatabase(requirement);
    
    const savedEntity = await this.repository.save(entity);
    return this.mapToEntity(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async countByUserId(userId: string): Promise<number> {
    return this.repository.count({
      where: { created_by: userId },
    });
  }

  private mapToEntity(entity: RequirementEntity): Requirement {
    return new Requirement(
      entity.id,
      entity.content,
      entity.is_private,
      entity.status as RequirementStatus,
      entity.created_by,
      entity.created_at,
      entity.updated_at
    );
  }

  private mapToDatabase(requirement: Requirement): Partial<RequirementEntity> {
    return {
      id: requirement.id,
      content: requirement.content,
      is_private: requirement.isPrivate,
      status: requirement.status,
      created_by: requirement.createdBy,
      created_at: requirement.createdAt,
      updated_at: requirement.updatedAt,
    };
  }
}