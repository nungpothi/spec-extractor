import { Webhook } from '../entities';

export interface WebhookRepository {
  create(webhook: Webhook): Promise<Webhook>;
  findById(id: string): Promise<Webhook | null>;
  findByUuid(uuid: string): Promise<Webhook | null>;
  findByUserId(userId: string): Promise<Webhook[]>;
  update(webhook: Webhook): Promise<Webhook>;
  delete(id: string): Promise<void>;
}