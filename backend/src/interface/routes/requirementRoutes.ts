import { Router } from 'express';
import { RequirementController } from '../controllers';
import { AuthMiddleware } from '../middleware';

const router = Router();
const requirementController = new RequirementController();

// All routes require authentication
router.use(AuthMiddleware.authenticate);

// POST /api/requirements - Create a new requirement
router.post('/', requirementController.createRequirement);

// GET /api/requirements - Get all requirements (ADMIN only)
router.get('/', requirementController.getAllRequirements);

export { router as requirementRoutes };