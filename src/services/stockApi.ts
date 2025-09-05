// Indian Stock Market - Mock Data (avoiding CORS issues)
// In production, use a backend proxy for real API calls

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap?: string;
  high: number;
  low: number;
  open: number;
}

export interface StockQuote {
  '01. symbol': string;
  '02. open': string;
  '03. high': string;
  '04. low': string;
  '05. price': string;
  '06. volume': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
  '10. change percent': string;
}

// Mock Indian stock data fallback
const mockStockData: Record<string, StockData> = {
  'RELIANCE': {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: 2456.75,
    change: 32.50,
    changePercent: 1.34,
    volume: '2.1M',
    marketCap: '16.6L Cr',
    high: 2478.90,
    low: 2445.20,
    open: 2450.00
  },
  'TCS': {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    price: 3542.80,
    change: -15.25,
    changePercent: -0.43,
    volume: '1.8M',
    marketCap: '12.9L Cr',
    high: 3565.40,
    low: 3535.10,
    open: 3558.05
  },
  'INFY': {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    price: 1456.30,
    change: 18.75,
    changePercent: 1.30,
    volume: '3.2M',
    marketCap: '6.1L Cr',
    high: 1465.80,
    low: 1442.50,
    open: 1448.90
  },
  'HDFCBANK': {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    price: 1678.45,
    change: 12.30,
    changePercent: 0.74,
    volume: '2.5M',
    marketCap: '12.8L Cr',
    high: 1685.20,
    low: 1665.80,
    open: 1670.15
  },
  'ICICIBANK': {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    price: 1089.60,
    change: -8.40,
    changePercent: -0.76,
    volume: '4.1M',
    marketCap: '7.6L Cr',
    high: 1098.75,
    low: 1085.30,
    open: 1095.20
  },
  'HINDUNILVR': {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd.',
    price: 2387.90,
    change: 25.60,
    changePercent: 1.08,
    volume: '1.2M',
    marketCap: '5.6L Cr',
    high: 2395.40,
    low: 2375.20,
    open: 2380.50
  },
  'ITC': {
    symbol: 'ITC',
    name: 'ITC Ltd.',
    price: 456.75,
    change: 3.25,
    changePercent: 0.72,
    volume: '5.8M',
    marketCap: '5.7L Cr',
    high: 459.80,
    low: 452.40,
    open: 454.20
  },
  'BHARTIARTL': {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd.',
    price: 1234.50,
    change: -12.75,
    changePercent: -1.02,
    volume: '3.4M',
    marketCap: '6.8L Cr',
    high: 1248.90,
    low: 1230.20,
    open: 1245.80
  }
};

export const stockApi = {
  // Get real-time Indian stock quote
  async getQuote(symbol: string): Promise<StockData> {
    try {
      const { backendApi } = await import('@/services/backendApi');
      return await backendApi.getStock(symbol);
    } catch (error) {
      console.error('Stock API error:', error);
      return mockStockData[symbol] || mockStockData['RELIANCE'];
    }
  },

  // Get multiple stock quotes
  async getMultipleQuotes(symbols: string[]): Promise<StockData[]> {
    const promises = symbols.map(symbol => this.getQuote(symbol));
    return Promise.all(promises);
  },

  // Search Indian stocks by keyword
  async searchStocks(keyword: string): Promise<Array<{symbol: string, name: string}>> {
    try {
      // For now, use mock search with popular Indian stocks
      const popularIndianStocks = [
        { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
        { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
        { symbol: 'INFY', name: 'Infosys Ltd.' },
        { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
        { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
        { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
        { symbol: 'ITC', name: 'ITC Ltd.' },
        { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' },
        { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.' },
        { symbol: 'LT', name: 'Larsen & Toubro Ltd.' },
        { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.' },
        { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.' },
        { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.' },
        { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.' },
        { symbol: 'WIPRO', name: 'Wipro Ltd.' },
        { symbol: 'TECHM', name: 'Tech Mahindra Ltd.' },
        { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.' },
        { symbol: 'TITAN', name: 'Titan Company Ltd.' },
        { symbol: 'NESTLEIND', name: 'Nestle India Ltd.' },
        { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.' }
      ];
      
      return popularIndianStocks
        .filter(stock => 
          stock.symbol.toLowerCase().includes(keyword.toLowerCase()) ||
          stock.name.toLowerCase().includes(keyword.toLowerCase())
        )
        .slice(0, 10);
    } catch (error) {
      console.error('Indian stock search error:', error);
      return [];
    }
  },

  // Get trending Indian stocks
  async getTrendingStocks(): Promise<StockData[]> {
    try {
      const { backendApi } = await import('@/services/backendApi');
      return await backendApi.getTrendingStocks();
    } catch (error) {
      console.error('Trending stocks error:', error);
      const trendingSymbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK'];
      const quotes = await this.getMultipleQuotes(trendingSymbols);
      return quotes.slice(0, 4);
    }
  },

  // Format volume numbers
  formatVolume(volume: number): string {
    if (volume >= 1000000000) {
      return (volume / 1000000000).toFixed(1) + 'B';
    } else if (volume >= 1000000) {
      return (volume / 1000000).toFixed(1) + 'M';
    } else if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toString();
  }
};