import { Router } from 'express';
import { PreviewController } from '../controllers';

export const createPreviewRoutes = (previewController: PreviewController): Router => {
  const router = Router();

  router.post('/preview', (req, res) => previewController.previewJson(req, res));

  return router;
};