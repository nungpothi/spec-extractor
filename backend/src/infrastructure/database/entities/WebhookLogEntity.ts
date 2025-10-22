import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { WebhookEntity } from './WebhookEntity';

@Entity('webhook_logs')
@Index(['webhook_id'])
@Index(['method'])
@Index(['created_at'])
export class WebhookLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  webhook_id!: string;

  @Column({ type: 'varchar', length: 10 })
  method!: string;

  @Column({ type: 'jsonb' })
  headers!: Record<string, any>;

  @Column({ type: 'jsonb' })
  body!: Record<string, any>;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => WebhookEntity)
  @JoinColumn({ name: 'webhook_id' })
  webhook!: WebhookEntity;
}