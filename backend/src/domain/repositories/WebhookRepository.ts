import { Webhook } from '../entities';

export interface WebhookRepository {
  create(webhook: Webhook): Promise<Webhook>;
  findByUuid(uuid: string): Promise<Webhook | null>;
  findByUserId(userId: string): Promise<Webhook[]>;
  update(webhook: Webhook): Promise<Webhook>;
  delete(id: string): Promise<void>;
}