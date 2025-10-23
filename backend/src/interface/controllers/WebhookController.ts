import { Request, Response } from 'express';
import { GenerateWebhookUsecase, LogWebhookRequestUsecase, GetWebhookLogsUsecase, GetUserWebhooksUsecase, UpdateWebhookResponseUsecase } from '../../usecases';
import { TypeORMWebhookRepository, TypeORMWebhookLogRepository } from '../../infrastructure/repositories';

export class WebhookController {
  private generateWebhookUsecase: GenerateWebhookUsecase;
  private logWebhookRequestUsecase: LogWebhookRequestUsecase;
  private getWebhookLogsUsecase: GetWebhookLogsUsecase;
  private getUserWebhooksUsecase: GetUserWebhooksUsecase;
  private updateWebhookResponseUsecase: UpdateWebhookResponseUsecase;

  constructor() {
    const webhookRepository = new TypeORMWebhookRepository();
    const webhookLogRepository = new TypeORMWebhookLogRepository();

    this.generateWebhookUsecase = new GenerateWebhookUsecase(webhookRepository);
    this.logWebhookRequestUsecase = new LogWebhookRequestUsecase(webhookRepository, webhookLogRepository);
    this.getWebhookLogsUsecase = new GetWebhookLogsUsecase(webhookRepository, webhookLogRepository);
    this.getUserWebhooksUsecase = new GetUserWebhooksUsecase(webhookRepository);
    this.updateWebhookResponseUsecase = new UpdateWebhookResponseUsecase(webhookRepository);
  }

  async generateWebhook(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          default: {
            status: false,
            message: 'Unauthorized',
            results: [],
            errors: ['User not authenticated']
          }
        });
        return;
      }

      const { response_template } = req.body || {};
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const result = await this.generateWebhookUsecase.execute(userId, baseUrl, response_template);

      res.status(200).json({
        default: {
          status: true,
          message: 'generated',
          results: [result],
          errors: []
        }
      });
    } catch (error) {
      console.error('Generate webhook error:', error);
      res.status(500).json({
        default: {
          status: false,
          message: 'Internal server error',
          results: [],
          errors: [error instanceof Error ? error.message : 'Unknown error']
        }
      });
    }
  }

  async handleWebhookRequest(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params as { uuid: string };
      const method = req.method;
      const headers = req.headers;
      const body = req.body || {};

      const customResponse = await this.logWebhookRequestUsecase.execute(uuid, method, headers, body);

      res.status(200).json(customResponse);
    } catch (error) {
      console.error('Handle webhook request error:', error);
      res.status(404).json({
        default: {
          status: false,
          message: 'Webhook not found',
          results: [],
          errors: [error instanceof Error ? error.message : 'Unknown error']
        }
      });
    }
  }

  async getWebhookLogs(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params as { uuid: string };
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          default: {
            status: false,
            message: 'Unauthorized',
            results: [],
            errors: ['User not authenticated']
          }
        });
        return;
      }

      const logs = await this.getWebhookLogsUsecase.execute(uuid, userId);

      res.status(200).json({
        default: {
          status: true,
          message: 'success',
          results: logs,
          errors: []
        }
      });
    } catch (error) {
      console.error('Get webhook logs error:', error);
      const statusCode = error instanceof Error && error.message.includes('Unauthorized') ? 403 :
                        error instanceof Error && error.message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        default: {
          status: false,
          message: 'Error retrieving webhook logs',
          results: [],
          errors: [error instanceof Error ? error.message : 'Unknown error']
        }
      });
    }
  }

  async listUserWebhooks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          default: {
            status: false,
            message: 'Unauthorized',
            results: [],
            errors: ['User not authenticated']
          }
        });
        return;
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const hooks = await this.getUserWebhooksUsecase.execute(userId, baseUrl);

      res.status(200).json({
        default: {
          status: true,
          message: 'success',
          results: hooks,
          errors: []
        }
      });
    } catch (error) {
      console.error('List user webhooks error:', error);
      res.status(500).json({
        default: {
          status: false,
          message: 'Internal server error',
          results: [],
          errors: [error instanceof Error ? error.message : 'Unknown error']
        }
      });
    }
  }

  async updateWebhookResponse(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params as { uuid: string };
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          default: {
            status: false,
            message: 'Unauthorized',
            results: [],
            errors: ['User not authenticated']
          }
        });
        return;
      }

      const { response_template } = req.body;
      if (!response_template) {
        res.status(400).json({
          default: {
            status: false,
            message: 'Bad request',
            results: [],
            errors: ['response_template is required']
          }
        });
        return;
      }

      const result = await this.updateWebhookResponseUsecase.execute(uuid, userId, response_template);

      res.status(200).json({
        default: {
          status: true,
          message: 'updated_response',
          results: [result],
          errors: []
        }
      });
    } catch (error) {
      console.error('Update webhook response error:', error);
      const statusCode = error instanceof Error && error.message.includes('Unauthorized') ? 403 :
                        error instanceof Error && error.message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        default: {
          status: false,
          message: 'Error updating webhook response',
          results: [],
          errors: [error instanceof Error ? error.message : 'Unknown error']
        }
      });
    }
  }
}
