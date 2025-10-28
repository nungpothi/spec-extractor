import { Router } from 'express';
import { PdfController } from '../controllers';

export const createPdfRoutes = (pdfController: PdfController): Router => {
  const router = Router();

  router.post('/pdf/render', (req, res) => pdfController.render(req, res));

  return router;
};
