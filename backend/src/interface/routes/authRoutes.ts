import { Router } from 'express';
import { AuthController } from '../controllers';
import { AuthMiddleware } from '../middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', AuthMiddleware.authenticate, authController.getCurrentUser);

export { router as authRoutes };