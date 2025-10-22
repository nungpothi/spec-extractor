import { Router } from 'express';
import { RequirementController } from '../controllers';
import { AuthMiddleware } from '../middleware';

const router = Router();
const requirementController = new RequirementController();

// All routes require authentication
router.use(AuthMiddleware.authenticate);

// POST /api/requirements - Create a new requirement
router.post('/', requirementController.createRequirement);

// GET /api/requirements - Get all requirements (role-based filtering)
router.get('/', requirementController.getAllRequirements);

// PUT /api/requirements/:id - Update a requirement (ADMIN only)
router.put('/:id', requirementController.updateRequirement);

export { router as requirementRoutes };