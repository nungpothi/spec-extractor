import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('specs')
export class SpecificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  summary!: string;

  @Column({ type: 'jsonb' })
  json_data!: object;

  @Column({ type: 'text' })
  preview_html!: string;

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
}