export * from './errorHandler';
export * from './requestLogger';
export * from './AuthMiddleware';

// Export the authentication middleware function
import { AuthMiddleware } from './AuthMiddleware';
export const authMiddleware = AuthMiddleware.authenticate;