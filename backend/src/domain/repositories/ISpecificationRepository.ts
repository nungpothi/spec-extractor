import { Specification } from '../entities';

export interface ISpecificationRepository {
  findAll(): Promise<Specification[]>;
  findById(id: string): Promise<Specification | null>;
  save(specification: Specification): Promise<Specification>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}