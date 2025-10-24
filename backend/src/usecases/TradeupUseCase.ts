import { TradeupCalculation } from '../domain/entities/TradeupCalculation';
import { ITradeupRepository } from '../domain/repositories/ITradeupRepository';

export interface CalculateTradeupRequest {
  knifePrice: number;
  created_by?: string;
}

export interface TradeupResultItem {
  rarity: string;
  count: number;
  maxPrice: number;
}

export class TradeupUseCase {
  constructor(private tradeupRepository: ITradeupRepository) {}

  async calculateTradeup(request: CalculateTradeupRequest): Promise<TradeupResultItem[]> {
    // Business validation
    if (!request.knifePrice || request.knifePrice <= 0) {
      throw new Error('Knife price must be greater than 0');
    }

    if (request.knifePrice > 1000000) {
      throw new Error('Knife price seems unrealistic (maximum 1,000,000 THB)');
    }

    // Create domain entity
    const calculation = new TradeupCalculation();
    calculation.updateCalculation(request.knifePrice);
    calculation.created_by = request.created_by;

    // Save calculation
    const savedCalculation = await this.tradeupRepository.create(calculation);

    // Return formatted results
    return savedCalculation.rarity_results.map(result => ({
      rarity: result.rarity,
      count: result.count,
      maxPrice: parseFloat(result.max_price.toFixed(3))
    }));
  }

  async getRecentCalculations(limit: number = 10): Promise<TradeupCalculation[]> {
    if (limit <= 0 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
    
    return this.tradeupRepository.findRecent(limit);
  }

  async getCalculationById(id: string): Promise<TradeupCalculation | null> {
    if (!id || id.trim().length === 0) {
      throw new Error('Calculation ID is required');
    }
    
    return this.tradeupRepository.findById(id);
  }

  async findCalculationsByKnifePrice(knifePrice: number): Promise<TradeupCalculation[]> {
    if (knifePrice <= 0) {
      throw new Error('Knife price must be greater than 0');
    }
    
    return this.tradeupRepository.findByKnifePrice(knifePrice);
  }
}