export interface TradeupCalculationRequest {
  knifePrice: number;
}

export interface TradeupResultItem {
  rarity: string;
  count: number;
  maxPrice: number;
}

export interface TradeupCalculation {
  id: string;
  knife_price: number;
  result_json: {
    knifePrice: number;
    results: TradeupResultItem[];
  };
  created_at: string;
  created_by?: string;
}

export interface TradeupRarityResult {
  id: string;
  tradeup_id: string;
  rarity: string;
  count: number;
  max_price: number;
  created_at: string;
}