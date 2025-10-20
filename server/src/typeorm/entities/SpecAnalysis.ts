import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'spec_analysis' })
export class SpecAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  uploadId!: string;

  @Column('varchar')
  projectId!: string;

  @Column('varchar')
  status!: 'processing' | 'done' | 'failed';

  @Column('varchar', { nullable: true })
  url!: string | null;

  @Column('varchar', { nullable: true })
  method!: string | null;

  @Column('text', { nullable: true })
  markdown!: string | null;

  @Column('jsonb', { nullable: true })
  jsonRaw!: any | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}

