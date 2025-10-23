import { v4 as uuidv4 } from 'uuid';
import { Webhook } from '../domain/entities';
import { WebhookRepository } from '../domain/repositories';

export class GenerateWebhookUsecase {
  constructor(private webhookRepository: WebhookRepository) {}

  async execute(userId: string, baseUrl: string, responseTemplate?: object): Promise<{ uuid: string; url: string; response_template: object | null }> {
    const webhookUuid = uuidv4();
    const webhook = new Webhook(webhookUuid, userId, responseTemplate);
    webhook.created_by = userId;

    const savedWebhook = await this.webhookRepository.create(webhook);
    
    return {
      uuid: savedWebhook.uuid_key,
      url: savedWebhook.getWebhookUrl(baseUrl),
      response_template: savedWebhook.response_template || null
    };
  }
}