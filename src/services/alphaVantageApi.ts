import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

let pricesCache: Record<string, any> = {};

export const alphaVantageApi = {
  async fetchPrices(): Promise<void> {
    try {
      const response = await axios.get(`${API_BASE_URL}/prices`);
      pricesCache = response.data;
      console.log('Successfully fetched prices from backend:', pricesCache);
    } catch (error) {
      console.error('Error fetching prices from backend:', error);
    }
  },

  startPriceSubscription(): void {
    // Fetch prices on startup
    this.fetchPrices();
    // Fetch prices every 30 seconds
    setInterval(() => this.fetchPrices(), 30 * 1000);
  },

  getSimulatedPrice(symbol: string): number {
    return pricesCache[symbol]?.price || 0;
  },

  getBaselinePrice(symbol: string): number {
    return pricesCache[symbol]?.price || 0;
  },

  getStockData(symbol: string): any {
    return pricesCache[symbol] || null;
  }
};

export default alphaVantageApi;
