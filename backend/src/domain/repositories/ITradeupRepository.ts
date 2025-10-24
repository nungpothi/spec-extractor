import { TradeupCalculation } from '../entities/TradeupCalculation';

export interface ITradeupRepository {
  findAll(): Promise<TradeupCalculation[]>;
  findById(id: string): Promise<TradeupCalculation | null>;
  create(calculation: Partial<TradeupCalculation>): Promise<TradeupCalculation>;
  findRecent(limit: number): Promise<TradeupCalculation[]>;
  findByKnifePrice(knifePrice: number): Promise<TradeupCalculation[]>;
}