import { stockApi } from './stockApi';

export interface Trade {
  id: string;
  userId?: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: Date;
  pnl?: number;
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
  dailyChange: number;
  dailyChangePercent: number;
  trades: Trade[];
}

// Fallback portfolio for offline mode
let fallbackPortfolio: Portfolio = {
  cash: 0,
  holdings: [],
  totalValue: 0,
  totalReturn: 0,
  returnPercent: 0,
  dailyChange: 0,
  dailyChangePercent: 0,
  trades: []
};



export const tradingApi = {
  // Get current portfolio
  async getPortfolio(): Promise<Portfolio> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) throw new Error('No user');
      
      const { firebaseApi } = await import('@/services/firebaseApi');
      return await firebaseApi.getPortfolio(user.id);
    } catch (error) {
      return {
        cash: 0,
        holdings: [],
        totalValue: 0,
        totalReturn: 0,
        returnPercent: 0,
        dailyChange: 0,
        dailyChangePercent: 0,
        trades: []
      };
    }
  },

  // Buy stock
  async buyStock(symbol: string, shares: number): Promise<{ success: boolean; message: string; trade?: Trade }> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) throw new Error('No user');
      
      const { stockApi } = await import('@/services/stockApi');
      const stock = await stockApi.getQuote(symbol);
      
      const { firebaseApi } = await import('@/services/firebaseApi');
      return await firebaseApi.buyStock(user.id, symbol, shares, stock.price);
    } catch (error) {
      return { success: false, message: 'Failed to execute trade' };
    }
  },

  // Sell stock
  async sellStock(symbol: string, shares: number): Promise<{ success: boolean; message: string; trade?: Trade }> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) throw new Error('No user');
      
      const { stockApi } = await import('@/services/stockApi');
      const stock = await stockApi.getQuote(symbol);
      
      const { firebaseApi } = await import('@/services/firebaseApi');
      return await firebaseApi.sellStock(user.id, symbol, shares, stock.price);
    } catch (error) {
      return { success: false, message: 'Failed to execute trade' };
    }
  },

  // Get trade history
  async getTradeHistory(): Promise<Trade[]> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) return [];
      
      const { firebaseApi } = await import('@/services/firebaseApi');
      return await firebaseApi.getTradeHistory(user.id);
    } catch (error) {
      return [];
    }
  }
};