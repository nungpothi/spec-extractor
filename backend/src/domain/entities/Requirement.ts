import { v4 as uuidv4 } from 'uuid';

export class Requirement {
  public readonly id: string;
  public readonly content: string;
  public readonly isPrivate: boolean;
  public readonly createdBy: string;
  public readonly createdAt: Date;
  public readonly updatedAt?: Date;

  constructor(
    id: string,
    content: string,
    isPrivate: boolean,
    createdBy: string,
    createdAt: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.content = content;
    this.isPrivate = isPrivate;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    content: string,
    isPrivate: boolean,
    createdBy: string
  ): Requirement {
    const id = uuidv4();
    const createdAt = new Date();

    return new Requirement(id, content, isPrivate, createdBy, createdAt);
  }

  public isValid(): boolean {
    return !!(
      this.id &&
      this.content &&
      typeof this.isPrivate === 'boolean' &&
      this.createdBy &&
      this.createdAt &&
      this.content.trim().length > 0
    );
  }

  public isOwnedBy(userId: string): boolean {
    return this.createdBy === userId;
  }

  public canBeViewedBy(userId: string, userRole: string): boolean {
    // Private requirements can only be viewed by the owner or admins
    if (this.isPrivate) {
      return this.isOwnedBy(userId) || userRole === 'ADMIN';
    }
    
    // Public requirements can be viewed by anyone
    return true;
  }
}