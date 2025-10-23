import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('webhooks')
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  uuid_key!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'jsonb', nullable: true })
  response_template?: object;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

  @Column({ type: 'uuid', nullable: true })
  deleted_by?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  constructor(uuid_key: string, user_id: string, response_template?: object) {
    this.uuid_key = uuid_key;
    this.user_id = user_id;
    this.response_template = response_template;
  }

  public getWebhookUrl(baseUrl: string): string {
    return `${baseUrl}/api/webhook/${this.uuid_key}`;
  }

  public getResponseTemplate(): object {
    return this.response_template || {
      default: {
        status: true,
        message: 'received',
        results: [],
        errors: []
      }
    };
  }

  public updateResponseTemplate(template: object): void {
    this.response_template = template;
  }
}