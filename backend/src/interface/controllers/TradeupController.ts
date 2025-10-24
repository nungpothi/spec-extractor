import { Request, Response } from 'express';
import { TradeupUseCase, CalculateTradeupRequest } from '../../usecases/TradeupUseCase';
import { ResponseHelper } from '../helpers/ResponseHelper';

export class TradeupController {
  constructor(private tradeupUseCase: TradeupUseCase) {}

  // POST /api/tradeup/calculate
  async calculateTradeup(req: Request, res: Response): Promise<void> {
    try {
      const calculateRequest: CalculateTradeupRequest = {
        knifePrice: parseFloat(req.body.knifePrice),
        created_by: req.body.created_by
      };

      const results = await this.tradeupUseCase.calculateTradeup(calculateRequest);
      const response = ResponseHelper.success(results);
      res.status(200).json({ default: response });
    } catch (error) {
      const response = ResponseHelper.error(
        error instanceof Error ? error.message : 'Failed to calculate trade-up'
      );
      res.status(400).json({ default: response });
    }
  }

  // GET /api/tradeup/recent
  async getRecentCalculations(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const calculations = await this.tradeupUseCase.getRecentCalculations(limit);
      
      const response = ResponseHelper.success(calculations);
      res.status(200).json({ default: response });
    } catch (error) {
      const response = ResponseHelper.error(
        error instanceof Error ? error.message : 'Failed to fetch recent calculations'
      );
      res.status(500).json({ default: response });
    }
  }

  // GET /api/tradeup/:id
  async getCalculationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const calculation = await this.tradeupUseCase.getCalculationById(id);
      
      if (!calculation) {
        const response = ResponseHelper.error('Calculation not found');
        res.status(404).json({ default: response });
        return;
      }

      const response = ResponseHelper.success(calculation);
      res.status(200).json({ default: response });
    } catch (error) {
      const response = ResponseHelper.error(
        error instanceof Error ? error.message : 'Failed to fetch calculation'
      );
      res.status(400).json({ default: response });
    }
  }
}