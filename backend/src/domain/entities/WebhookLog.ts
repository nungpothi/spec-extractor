import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Webhook } from './Webhook';

@Entity('webhook_logs')
export class WebhookLog {
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

  @ManyToOne(() => Webhook)
  @JoinColumn({ name: 'webhook_id' })
  webhook!: Webhook;

  constructor(webhook_id: string, method: string, headers: Record<string, any>, body: Record<string, any>) {
    this.webhook_id = webhook_id;
    this.method = method;
    this.headers = headers;
    this.body = body;
  }

  public isValidMethod(): boolean {
    const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
    return validMethods.includes(this.method.toUpperCase());
  }

  public getFormattedHeaders(): string {
    try {
      return JSON.stringify(this.headers, null, 2);
    } catch {
      return String(this.headers);
    }
  }

  public getFormattedBody(): string {
    try {
      return JSON.stringify(this.body, null, 2);
    } catch {
      return String(this.body);
    }
  }
}