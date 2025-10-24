import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Template } from './Template';

@Entity('template_logs')
export class TemplateLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  template_id!: string;

  @ManyToOne(() => Template, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template!: Template;

  @Column({ type: 'varchar', length: 50 })
  action!: string;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

  @Column({ type: 'uuid', nullable: true })
  deleted_by?: string;

  // Domain logic methods
  public static createLog(templateId: string, action: string, details?: string, userId?: string): TemplateLog {
    const log = new TemplateLog();
    log.template_id = templateId;
    log.action = action;
    log.details = details;
    log.created_by = userId;
    return log;
  }

  public isCreateAction(): boolean {
    return this.action === 'CREATE';
  }

  public isUpdateAction(): boolean {
    return this.action === 'UPDATE';
  }

  public isDeleteAction(): boolean {
    return this.action === 'DELETE';
  }
}