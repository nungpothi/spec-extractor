import { Router } from 'express';
import { TradeupController } from '../controllers/TradeupController';
import { TradeupUseCase } from '../../usecases/TradeupUseCase';
import { TradeupRepository } from '../../infrastructure/repositories/TradeupRepository';
import { AppDataSource } from '../../infrastructure/config/database';

export const createTradeupRoutes = (): Router => {
  const router = Router();
  
  // Dependency injection
  const tradeupRepository = new TradeupRepository(AppDataSource);
  const tradeupUseCase = new TradeupUseCase(tradeupRepository);
  const tradeupController = new TradeupController(tradeupUseCase);

  // Routes
  router.post('/calculate', tradeupController.calculateTradeup.bind(tradeupController));
  router.get('/recent', tradeupController.getRecentCalculations.bind(tradeupController));
  router.get('/:id', tradeupController.getCalculationById.bind(tradeupController));

  return router;
};