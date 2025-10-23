import { WebhookRepository } from '../domain/repositories';

export class UpdateWebhookResponseUsecase {
  constructor(private webhookRepository: WebhookRepository) {}

  async execute(webhookUuid: string, userId: string, responseTemplate: object): Promise<{ uuid: string }> {
    // Find the webhook by UUID
    const webhook = await this.webhookRepository.findByUuid(webhookUuid);
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    // Check if the user owns this webhook
    if (webhook.user_id !== userId) {
      throw new Error('Unauthorized: You can only update your own webhooks');
    }

    // Update the response template
    webhook.updateResponseTemplate(responseTemplate);
    webhook.updated_by = userId;

    // Save the updated webhook
    await this.webhookRepository.update(webhook);

    return {
      uuid: webhook.uuid_key
    };
  }
}