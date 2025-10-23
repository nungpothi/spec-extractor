import { Router } from 'express';
import { WebhookController } from '../controllers';
import { authMiddleware } from '../middleware';

const router = Router();
const webhookController = new WebhookController();

// Generate a new webhook URL (requires authentication)
router.post('/generate', authMiddleware, (req, res) => webhookController.generateWebhook(req, res));

// List user's webhooks (requires authentication)
router.get('/', authMiddleware, (req, res) => webhookController.listUserWebhooks(req, res));

// Update webhook response template (requires authentication and ownership)
router.put('/:uuid/response', authMiddleware, (req, res) => webhookController.updateWebhookResponse(req, res));

// Webhook endpoint - handle incoming requests (no auth required)
router.all('/:uuid', (req, res) => webhookController.handleWebhookRequest(req, res));

// Get webhook logs (requires authentication and ownership)
router.get('/:uuid/logs', authMiddleware, (req, res) => webhookController.getWebhookLogs(req, res));

export { router as webhookRoutes };
