import { Router } from 'express';
import { SpecificationController } from '../controllers';

export const createSpecificationRoutes = (specificationController: SpecificationController): Router => {
  const router = Router();

  router.get('/specs', (req, res) => specificationController.getAllSpecs(req, res));
  router.get('/specs/:id', (req, res) => specificationController.getSpecById(req, res));
  router.post('/specs', (req, res) => specificationController.createSpec(req, res));
  router.delete('/specs/:id', (req, res) => specificationController.deleteSpec(req, res));

  return router;
};