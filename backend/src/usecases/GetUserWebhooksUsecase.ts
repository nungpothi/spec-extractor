import { WebhookRepository } from '../domain/repositories';

export class GetUserWebhooksUsecase {
  constructor(private webhookRepository: WebhookRepository) {}

  async execute(userId: string, baseUrl: string): Promise<Array<{ id: string; uuid_key: string; url: string; created_at: string }>> {
    const hooks = await this.webhookRepository.findByUserId(userId);
    return hooks
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(h => ({
        id: h.id,
        uuid_key: h.uuid_key,
        url: h.getWebhookUrl(baseUrl),
        created_at: h.created_at.toISOString(),
      }));
  }
}

