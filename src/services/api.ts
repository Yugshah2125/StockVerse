// Basic API service layer
const API_BASE = 'https://api.example.com'; // Replace with actual API

export interface User {
  id: string;
  name: string;
  email: string;
  virtualCash: number;
  portfolioValue: number;
  level: number;
  xp: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface Portfolio {
  holdings: Array<{
    symbol: string;
    shares: number;
    avgPrice: number;
    currentPrice: number;
  }>;
  totalValue: number;
  totalChange: number;
}

// Deprecated - use backendApi instead
export const api = {
  async getUser(): Promise<User> {
    throw new Error('Use backendApi instead');
  },
  async getStockPrice(symbol: string): Promise<Stock> {
    throw new Error('Use backendApi instead');
  },
  async getPortfolio(): Promise<Portfolio> {
    throw new Error('Use backendApi instead');
  },
  async buyStock(symbol: string, shares: number): Promise<boolean> {
    throw new Error('Use backendApi instead');
  },
  async sellStock(symbol: string, shares: number): Promise<boolean> {
    throw new Error('Use backendApi instead');
  }
};