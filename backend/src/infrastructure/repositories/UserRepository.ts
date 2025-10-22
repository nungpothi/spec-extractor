import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories';
import { User } from '../../domain/entities';
import { UserEntity } from '../database/entities';
import { AppDataSource } from '../database/dataSource';

export class UserRepository implements IUserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({
      where: { email },
    });

    if (!userEntity) {
      return null;
    }

    return this.mapToEntity(userEntity);
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({
      where: { id },
    });

    if (!userEntity) {
      return null;
    }

    return this.mapToEntity(userEntity);
  }

  async save(user: User): Promise<User> {
    const userEntity = this.mapToDatabase(user);
    
    const savedEntity = await this.repository.save(userEntity);
    return this.mapToEntity(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { email },
    });
    return count > 0;
  }

  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { phone },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  private mapToEntity(userEntity: UserEntity): User {
    return new User(
      userEntity.id,
      userEntity.phone,
      userEntity.email,
      userEntity.password_hash,
      userEntity.role as 'ADMIN' | 'VISITOR',
      userEntity.created_at,
      userEntity.updated_at
    );
  }

  private mapToDatabase(user: User): Partial<UserEntity> {
    return {
      id: user.id,
      phone: user.phone,
      email: user.email,
      password_hash: user.passwordHash,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}