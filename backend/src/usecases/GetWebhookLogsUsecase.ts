import { WebhookLog } from '../domain/entities';
import { WebhookRepository, WebhookLogRepository } from '../domain/repositories';

export class GetWebhookLogsUsecase {
  constructor(
    private webhookRepository: WebhookRepository,
    private webhookLogRepository: WebhookLogRepository
  ) {}

  async execute(webhookUuid: string, userId: string): Promise<WebhookLog[]> {
    // Find the webhook by UUID
    const webhook = await this.webhookRepository.findByUuid(webhookUuid);
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    // Check if the user owns this webhook
    if (webhook.user_id !== userId) {
      throw new Error('Unauthorized: You can only view logs for your own webhooks');
    }

    // Get all logs for this webhook
    const logs = await this.webhookLogRepository.findByWebhookId(webhook.id);
    
    return logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}