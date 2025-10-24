import api from './api';
import { TradeupCalculationRequest, TradeupResultItem, TradeupCalculation } from '@/types/tradeup';
import { ApiResponseWrapper } from '@/types/api';

export class TradeupService {
  private static baseUrl = '/tradeup';

  static async calculate(data: TradeupCalculationRequest): Promise<TradeupResultItem[]> {
    const response = await api.post<ApiResponseWrapper<TradeupResultItem[]>>(
      `${this.baseUrl}/calculate`, 
      data
    );
    
    if (!response.data.default.status) {
      throw new Error(response.data.default.message || 'Failed to calculate trade-up');
    }
    
    return response.data.default.results;
  }

  static async getRecent(limit: number = 10): Promise<TradeupCalculation[]> {
    const response = await api.get<ApiResponseWrapper<TradeupCalculation[]>>(
      `${this.baseUrl}/recent?limit=${limit}`
    );
    
    if (!response.data.default.status) {
      throw new Error(response.data.default.message || 'Failed to fetch recent calculations');
    }
    
    return response.data.default.results;
  }

  static async getById(id: string): Promise<TradeupCalculation> {
    const response = await api.get<ApiResponseWrapper<TradeupCalculation>>(
      `${this.baseUrl}/${id}`
    );
    
    if (!response.data.default.status) {
      throw new Error(response.data.default.message || 'Failed to fetch calculation');
    }
    
    return response.data.default.results;
  }
}