import { create } from 'zustand';
import { TradeupCalculationRequest, TradeupResultItem, TradeupCalculation } from '@/types/tradeup';
import { TradeupService } from '@/services/tradeupService';

interface TradeupState {
  results: TradeupResultItem[];
  recentCalculations: TradeupCalculation[];
  loading: boolean;
  error: string | null;
  
  // Actions
  calculateTradeup: (data: TradeupCalculationRequest) => Promise<TradeupResultItem[]>;
  getRecentCalculations: (limit?: number) => Promise<void>;
  clearError: () => void;
  clearResults: () => void;
}

export const useTradeupStore = create<TradeupState>((set, get) => ({
  results: [],
  recentCalculations: [],
  loading: false,
  error: null,

  calculateTradeup: async (data: TradeupCalculationRequest) => {
    set({ loading: true, error: null });
    try {
      const results = await TradeupService.calculate(data);
      set({ results, loading: false });
      // Refresh recent calculations after new calculation
      await get().getRecentCalculations();
      return results;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to calculate trade-up',
        loading: false 
      });
      throw error;
    }
  },

  getRecentCalculations: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const recentCalculations = await TradeupService.getRecent(limit);
      set({ recentCalculations, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch recent calculations',
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  
  clearResults: () => set({ results: [] }),
}));