import { Requirement } from '../entities';

export interface IRequirementRepository {
  findAll(): Promise<Requirement[]>;
  findByUserId(userId: string): Promise<Requirement[]>;
  findPublicRequirements(): Promise<Requirement[]>;
  findByUserOrPublic(userId: string): Promise<Requirement[]>;
  findById(id: string): Promise<Requirement | null>;
  save(requirement: Requirement): Promise<Requirement>;
  update(requirement: Requirement): Promise<Requirement>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  countByUserId(userId: string): Promise<number>;
}