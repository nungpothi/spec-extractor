import { WebhookLog } from '../entities';

export interface WebhookLogRepository {
  create(webhookLog: WebhookLog): Promise<WebhookLog>;
  findByWebhookId(webhookId: string): Promise<WebhookLog[]>;
  findById(id: string): Promise<WebhookLog | null>;
  delete(id: string): Promise<void>;
}