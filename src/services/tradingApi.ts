import { stockApi } from './stockApi';

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: Date;
}

export interface Holding {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  totalReturn: number;
  returnPercent: number;
}

export interface Portfolio {
  cash: number;
  holdings: Holding[];
  totalValue: number;
  totalReturn: number;
  returnPercent: number;
  trades: Trade[];
}

// Fallback portfolio for offline mode
let fallbackPortfolio: Portfolio = {
  cash: 0,
  holdings: [],
  totalValue: 0,
  totalReturn: 0,
  returnPercent: 0,
  trades: []
};

export const tradingApi = {
  // Get current portfolio
  async getPortfolio(): Promise<Portfolio> {
    try {
      const { backendApi } = await import('@/services/backendApi');
      return await backendApi.getPortfolio();
    } catch (error) {
      console.error('Portfolio error:', error);
      return fallbackPortfolio;
    }
  },

  // Buy stock
  async buyStock(symbol: string, shares: number): Promise<{ success: boolean; message: string; trade?: Trade }> {
    try {
      const { backendApi } = await import('@/services/backendApi');
      return await backendApi.buyStock(symbol, shares);
    } catch (error) {
      console.error('Buy stock error:', error);
      return { success: false, message: 'Failed to execute trade' };
    }
  },

  // Sell stock
  async sellStock(symbol: string, shares: number): Promise<{ success: boolean; message: string; trade?: Trade }> {
    try {
      const { backendApi } = await import('@/services/backendApi');
      return await backendApi.sellStock(symbol, shares);
    } catch (error) {
      console.error('Sell stock error:', error);
      return { success: false, message: 'Failed to execute trade' };
    }
  },

  // Get trade history
  async getTradeHistory(): Promise<Trade[]> {
    return fallbackPortfolio.trades;
  }
};