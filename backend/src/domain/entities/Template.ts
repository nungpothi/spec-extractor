import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  category!: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

  @Column({ type: 'uuid', nullable: true })
  deleted_by?: string;

  // Domain logic methods
  public isActive(): boolean {
    return this.status === 'active';
  }

  public isInactive(): boolean {
    return this.status === 'inactive';
  }

  public changeStatus(newStatus: string): void {
    if (!['active', 'inactive'].includes(newStatus)) {
      throw new Error('Invalid status. Must be active or inactive');
    }
    this.status = newStatus;
  }

  public updateDetails(name: string, description?: string, category?: string, notes?: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name is required');
    }
    this.name = name.trim();
    this.description = description?.trim();
    this.category = category || this.category;
    this.notes = notes?.trim();
  }

  public canBeDeleted(): boolean {
    return this.isActive() || this.isInactive();
  }
}