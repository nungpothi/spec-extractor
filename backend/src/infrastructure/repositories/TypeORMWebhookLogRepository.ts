import { Repository } from 'typeorm';
import { WebhookLog } from '../../domain/entities';
import { WebhookLogRepository } from '../../domain/repositories';
import { AppDataSource } from '../database';
import { WebhookLogEntity } from '../database/entities';

export class TypeORMWebhookLogRepository implements WebhookLogRepository {
  private repository: Repository<WebhookLogEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(WebhookLogEntity);
  }

  async create(webhookLog: WebhookLog): Promise<WebhookLog> {
    const webhookLogEntity = this.repository.create({
      webhook_id: webhookLog.webhook_id,
      method: webhookLog.method,
      headers: webhookLog.headers,
      body: webhookLog.body,
    });

    const savedEntity = await this.repository.save(webhookLogEntity);
    return this.toDomainEntity(savedEntity);
  }

  async findByWebhookId(webhookId: string): Promise<WebhookLog[]> {
    const webhookLogEntities = await this.repository.find({
      where: { webhook_id: webhookId },
      order: { created_at: 'DESC' }
    });

    return webhookLogEntities.map(entity => this.toDomainEntity(entity));
  }

  async findById(id: string): Promise<WebhookLog | null> {
    const webhookLogEntity = await this.repository.findOne({
      where: { id }
    });

    return webhookLogEntity ? this.toDomainEntity(webhookLogEntity) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomainEntity(entity: WebhookLogEntity): WebhookLog {
    const webhookLog = new WebhookLog(entity.webhook_id, entity.method, entity.headers, entity.body);
    webhookLog.id = entity.id;
    webhookLog.created_at = entity.created_at;
    return webhookLog;
  }
}