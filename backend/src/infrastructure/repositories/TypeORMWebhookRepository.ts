import { Repository } from 'typeorm';
import { Webhook } from '../../domain/entities';
import { WebhookRepository } from '../../domain/repositories';
import { AppDataSource } from '../database/dataSource';
import { WebhookEntity } from '../database/entities';

export class TypeORMWebhookRepository implements WebhookRepository {
  private repository: Repository<WebhookEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(WebhookEntity);
  }

  async create(webhook: Webhook): Promise<Webhook> {
    const webhookEntity = this.repository.create({
      uuid_key: webhook.uuid_key,
      user_id: webhook.user_id,
      response_template: webhook.response_template,
      created_by: webhook.created_by,
      updated_by: webhook.updated_by,
    });

    const savedEntity = await this.repository.save(webhookEntity);
    return this.toDomainEntity(savedEntity);
  }

  async findByUuid(uuid: string): Promise<Webhook | null> {
    const webhookEntity = await this.repository.findOne({
      where: { uuid_key: uuid },
      relations: ['user']
    });

    return webhookEntity ? this.toDomainEntity(webhookEntity) : null;
  }

  async findByUserId(userId: string): Promise<Webhook[]> {
    const webhookEntities = await this.repository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' }
    });

    return webhookEntities.map(entity => this.toDomainEntity(entity));
  }

  async update(webhook: Webhook): Promise<Webhook> {
    const webhookEntity = await this.repository.findOne({
      where: { id: webhook.id }
    });

    if (!webhookEntity) {
      throw new Error('Webhook not found');
    }

    const updatedEntity = Object.assign(webhookEntity, {
      uuid_key: webhook.uuid_key,
      user_id: webhook.user_id,
      response_template: webhook.response_template,
      updated_by: webhook.updated_by,
    });

    const savedEntity = await this.repository.save(updatedEntity);
    return this.toDomainEntity(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  private toDomainEntity(entity: WebhookEntity): Webhook {
    const webhook = new Webhook(entity.uuid_key, entity.user_id, entity.response_template);
    webhook.id = entity.id;
    webhook.created_at = entity.created_at;
    webhook.updated_at = entity.updated_at;
    webhook.deleted_at = entity.deleted_at;
    webhook.created_by = entity.created_by;
    webhook.updated_by = entity.updated_by;
    webhook.deleted_by = entity.deleted_by;
    return webhook;
  }
}
