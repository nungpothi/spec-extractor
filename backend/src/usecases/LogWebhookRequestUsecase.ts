import { WebhookLog } from '../domain/entities';
import { WebhookRepository, WebhookLogRepository } from '../domain/repositories';

export class LogWebhookRequestUsecase {
  constructor(
    private webhookRepository: WebhookRepository,
    private webhookLogRepository: WebhookLogRepository
  ) {}

  async execute(
    webhookUuid: string,
    method: string,
    headers: Record<string, any>,
    body: Record<string, any>
  ): Promise<object> {
    // Find the webhook by UUID
    const webhook = await this.webhookRepository.findByUuid(webhookUuid);
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    // Create webhook log entry
    const webhookLog = new WebhookLog(webhook.id, method.toUpperCase(), headers, body);
    
    await this.webhookLogRepository.create(webhookLog);

    // Return the custom response template or default response
    return webhook.getResponseTemplate();
  }
}