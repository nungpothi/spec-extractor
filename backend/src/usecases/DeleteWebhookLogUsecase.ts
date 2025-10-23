import { WebhookRepository, WebhookLogRepository } from '../domain/repositories';

export class DeleteWebhookLogUsecase {
  constructor(
    private webhookRepository: WebhookRepository,
    private webhookLogRepository: WebhookLogRepository
  ) {}

  async execute(logId: string, userId: string): Promise<void> {
    // Find the webhook log by ID
    const webhookLog = await this.webhookLogRepository.findById(logId);
    if (!webhookLog) {
      throw new Error('Webhook log not found');
    }

    // Find the webhook that owns this log
    const webhook = await this.webhookRepository.findById(webhookLog.webhook_id);
    if (!webhook) {
      throw new Error('Associated webhook not found');
    }

    // Check if the user owns this webhook (and therefore can delete its logs)
    if (webhook.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete logs for your own webhooks');
    }

    // Delete the log
    await this.webhookLogRepository.delete(logId);
  }
}