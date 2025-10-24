import { Router } from 'express';
import { TemplateController } from '../controllers/TemplateController';
import { TemplateUseCase } from '../../usecases/TemplateUseCase';
import { TemplateRepository } from '../../infrastructure/repositories/TemplateRepository';
import { AppDataSource } from '../../infrastructure/config/database';

export const createTemplateRoutes = (): Router => {
  const router = Router();
  
  // Dependency injection
  const templateRepository = new TemplateRepository(AppDataSource);
  const templateUseCase = new TemplateUseCase(templateRepository);
  const templateController = new TemplateController(templateUseCase);

  // Routes
  router.get('/list', templateController.getAllTemplates.bind(templateController));
  router.get('/:id', templateController.getTemplateById.bind(templateController));
  router.post('/create', templateController.createTemplate.bind(templateController));
  router.put('/update/:id', templateController.updateTemplate.bind(templateController));
  router.delete('/delete/:id', templateController.deleteTemplate.bind(templateController));

  return router;
};