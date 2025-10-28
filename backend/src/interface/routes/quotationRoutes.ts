import { Router } from 'express';
import { QuotationController } from '../controllers';
import { AuthMiddleware } from '../middleware';

const router = Router();
const quotationController = new QuotationController();

router.use(AuthMiddleware.authenticate);

router.post('/', quotationController.createQuotation);
router.get('/', quotationController.getQuotations);
router.get('/:id', quotationController.getQuotationById);
router.put('/:id', quotationController.updateQuotation);
router.get('/:id/share', quotationController.generateShareLink);
router.get('/:id/pdf', quotationController.downloadQuotationPdf);

export { router as quotationRoutes };
