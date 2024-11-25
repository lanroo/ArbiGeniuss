export interface ExchangePrice {
  exchange: string;
  symbol: string;
  price: number;
  timestamp: number;
}

export interface ArbitrageOpportunity {
  symbol: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  profitPercentage: number;
  timestamp: number;
}

export interface ExchangeCredentials {
  apiKey: string;
  apiSecret: string;
}

export interface TradeResult {
  success: boolean;
  orderId?: string;
  error?: string;
  details?: {
    price: number;
    quantity: number;
    total: number;
  };
}