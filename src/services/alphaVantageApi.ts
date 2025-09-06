import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'GCYI2FOW4X7UN78B';
const BASE_URL = 'https://www.alphavantage.co/query';

// Daily baseline prices cache
let dailyPricesCache: Record<string, number> = {};
let lastFetchDate = '';

import { ALL_SYMBOLS } from '../data/indianStocks';

// Convert Alpha Vantage symbol to internal symbol
const convertSymbol = (avSymbol: string): string => {
  // Index funds don't need conversion
  if (!avSymbol.includes('.BSE')) return avSymbol;
  
  const mapping: Record<string, string> = {
    'HUL.BSE': 'HINDUNILVR', 'M&M.BSE': 'M&M', 'BAJAJ-AUTO.BSE': 'BAJAJ-AUTO'
  };
  return mapping[avSymbol] || avSymbol.replace('.BSE', '');
};

export const alphaVantageApi = {
  // Check if today is a market holiday
  isMarketHoliday(): boolean {
    const today = new Date();
    const day = today.getDay();
    if (day === 0 || day === 6) return true;
    
    const holidays = ['2024-01-26', '2024-03-08', '2024-03-29', '2024-08-15', '2024-10-02', '2024-12-25'];
    const todayStr = today.toISOString().split('T')[0];
    return holidays.includes(todayStr);
  },

  // Fetch daily baseline prices for top 300 stocks once per day
  async fetchDailyPrices(): Promise<void> {
    const today = new Date().toDateString();
    if (lastFetchDate === today || this.isMarketHoliday()) return;
    
    const topSymbols = ['NIFTY50', 'NIFTYBANK', 'NIFTYIT', 'SENSEX', 'NIFTYMIDCAP', ...ALL_SYMBOLS.slice(0, 295)];
    
    console.log('📈 Fetching top 300 daily prices from Alpha Vantage...');
    let fetchedCount = 0;
    
    for (const avSymbol of topSymbols) {
      try {
        const isIndex = !avSymbol.includes('.BSE');
        const params = isIndex ? {
          function: 'TIME_SERIES_DAILY',
          symbol: avSymbol,
          apikey: ALPHA_VANTAGE_API_KEY
        } : {
          function: 'GLOBAL_QUOTE',
          symbol: avSymbol,
          apikey: ALPHA_VANTAGE_API_KEY
        };
        
        const response = await axios.get(BASE_URL, {
          params,
          timeout: 5000
        });
        
        let price;
        if (isIndex) {
          const timeSeries = response.data['Time Series (Daily)'];
          const latestDate = Object.keys(timeSeries || {})[0];
          price = timeSeries?.[latestDate]?.['4. close'];
        } else {
          const quote = response.data['Global Quote'];
          price = quote?.['05. price'];
        }
        
        if (price && !isNaN(parseFloat(price))) {
          const symbol = convertSymbol(avSymbol);
          dailyPricesCache[symbol] = parseFloat(price);
          fetchedCount++;
        }
      } catch (error) {
        console.warn(`Failed to fetch ${avSymbol}:`, error.message);
      }
      
      await new Promise(resolve => setTimeout(resolve, 12000));
    }
    
    lastFetchDate = today;
    console.log(`✅ Fetched ${fetchedCount}/300 daily prices from Alpha Vantage`);
  },

  // Start daily system
  startDailySystem(): void {
    // Initialize with comprehensive fallback prices for all 455 symbols
    const fallbackPrices: Record<string, number> = {};
    
    // Index Funds (realistic prices)
    fallbackPrices['NIFTY50'] = 21456.30;
    fallbackPrices['NIFTYBANK'] = 48234.75;
    fallbackPrices['NIFTYIT'] = 34567.90;
    fallbackPrices['SENSEX'] = 71234.85;
    fallbackPrices['NIFTYMIDCAP'] = 12345.60;
    
    // Generate fallback prices for all 450 stocks
    ALL_SYMBOLS.forEach(symbol => {
      if (!symbol.includes('.BSE')) return; // Skip indices
      const cleanSymbol = convertSymbol(symbol);
      if (!fallbackPrices[cleanSymbol]) {
        // Generate realistic fallback price based on symbol hash
        const hash = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const basePrice = 100 + (hash % 3000) + (hash % 100) * 10;
        fallbackPrices[cleanSymbol] = Math.round(basePrice * 100) / 100;
      }
    });
    
    // Set known major stock prices
    Object.assign(fallbackPrices, {
      'RELIANCE': 2456.75, 'TCS': 3542.80, 'HDFCBANK': 1678.45,
      'INFY': 1456.30, 'ICICIBANK': 1089.60, 'HINDUNILVR': 2387.90,
      'ITC': 456.75, 'SBIN': 623.45, 'BHARTIARTL': 1234.50,
      'KOTAKBANK': 1789.25, 'MARUTI': 10234.75, 'ZOMATO': 156.75
    });
    
    dailyPricesCache = fallbackPrices;
    
    // Fetch immediately on startup if it's morning or no data cached
    setTimeout(() => this.fetchDailyPrices(), 5000);
    
    // Check every hour for daily fetch at 9 AM
    setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      if (hours === 9) {
        this.fetchDailyPrices();
      }
    }, 3600000);
  },

  // Get baseline price
  getBaselinePrice(symbol: string): number {
    return dailyPricesCache[symbol] || {
      'RELIANCE': 2456.75, 'TCS': 3542.80, 'HDFCBANK': 1678.45,
      'INFY': 1456.30, 'ICICIBANK': 1089.60, 'HINDUNILVR': 2387.90,
      'ITC': 456.75, 'SBIN': 623.45, 'BHARTIARTL': 1234.50,
      'KOTAKBANK': 1789.25, 'NIFTY50': 21456.30, 'NIFTYBANK': 48234.75,
      'NIFTYIT': 34567.90, 'SENSEX': 71234.85, 'NIFTYMIDCAP': 12345.60
    }[symbol] || 1000;
  },

  // Generate mock price with different volatility by asset type
  getSimulatedPrice(symbol: string): number {
    const baseline = this.getBaselinePrice(symbol);
    const now = Date.now();
    const symbolHash = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const seed = Math.sin(now / 3000 + symbolHash) * Math.cos(now / 2000 + symbolHash * 0.1);
    
    // Different volatility by asset type
    const isIndex = ['NIFTY50', 'NIFTYBANK', 'NIFTYIT', 'SENSEX', 'NIFTYMIDCAP'].includes(symbol);
    const isLargeCap = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN', 'BHARTIARTL', 'KOTAKBANK'].includes(symbol);
    
    let volatility;
    if (isIndex) {
      volatility = 0.003; // 0.3% for indices
    } else if (isLargeCap) {
      volatility = 0.006; // 0.6% for large cap
    } else {
      volatility = 0.012; // 1.2% for mid/small cap
    }
    
    return baseline * (1 + seed * volatility);
  }
};

export default alphaVantageApi;