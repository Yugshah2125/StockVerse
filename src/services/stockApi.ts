// Indian Stock Market - Real-time Price Simulation
// Simulates live price movements for realistic trading experience

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

// Real-time price generation
const generateRealtimePrice = (basePrice: number, symbol: string) => {
  const now = Date.now();
  const seed = Math.sin(now / 10000 + symbol.length) * Math.cos(now / 5000);
  const variation = seed * 0.05; // ±5% variation
  const newPrice = basePrice * (1 + variation);
  const change = newPrice - basePrice;
  const changePercent = (change / basePrice) * 100;
  
  return {
    price: parseFloat(newPrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2))
  };
};

// Comprehensive Indian stock database
const indianStocks = [
  // Nifty 50 Stocks
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2456.75, sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 3542.80, sector: 'IT' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1678.45, sector: 'Banking' },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: 1456.30, sector: 'IT' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1089.60, sector: 'Banking' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', price: 2387.90, sector: 'FMCG' },
  { symbol: 'ITC', name: 'ITC Ltd.', price: 456.75, sector: 'FMCG' },
  { symbol: 'SBIN', name: 'State Bank of India', price: 623.45, sector: 'Banking' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1234.50, sector: 'Telecom' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', price: 1789.25, sector: 'Banking' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', price: 3456.80, sector: 'Infrastructure' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', price: 3234.60, sector: 'Paints' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', price: 10234.75, sector: 'Auto' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', price: 6789.45, sector: 'NBFC' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', price: 1567.80, sector: 'IT' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', price: 1123.45, sector: 'Banking' },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', price: 567.90, sector: 'IT' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.', price: 8765.40, sector: 'Cement' },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd.', price: 23456.75, sector: 'FMCG' },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', price: 3456.25, sector: 'Jewellery' },
  
  // Banking Sector
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', price: 234.50, sector: 'Banking' },
  { symbol: 'PNB', name: 'Punjab National Bank', price: 123.45, sector: 'Banking' },
  { symbol: 'CANBK', name: 'Canara Bank', price: 345.60, sector: 'Banking' },
  { symbol: 'UNIONBANK', name: 'Union Bank of India', price: 156.75, sector: 'Banking' },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd.', price: 89.45, sector: 'Banking' },
  
  // IT Sector
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', price: 1234.60, sector: 'IT' },
  { symbol: 'LTIM', name: 'LTIMindtree Ltd.', price: 5678.90, sector: 'IT' },
  { symbol: 'MPHASIS', name: 'Mphasis Ltd.', price: 2345.75, sector: 'IT' },
  { symbol: 'COFORGE', name: 'Coforge Ltd.', price: 4567.25, sector: 'IT' },
  
  // Auto Sector
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: 789.45, sector: 'Auto' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', price: 1567.80, sector: 'Auto' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.', price: 6789.25, sector: 'Auto' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', price: 4567.90, sector: 'Auto' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.', price: 3456.75, sector: 'Auto' },
  
  // Pharma Sector
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.', price: 1234.50, sector: 'Pharma' },
  { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories Ltd.', price: 5678.25, sector: 'Pharma' },
  { symbol: 'CIPLA', name: 'Cipla Ltd.', price: 1456.75, sector: 'Pharma' },
  { symbol: 'BIOCON', name: 'Biocon Ltd.', price: 345.60, sector: 'Pharma' },
  { symbol: 'LUPIN', name: 'Lupin Ltd.', price: 1789.45, sector: 'Pharma' },
  
  // Steel & Metals
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.', price: 134.75, sector: 'Steel' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.', price: 789.60, sector: 'Steel' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.', price: 456.25, sector: 'Metals' },
  { symbol: 'VEDL', name: 'Vedanta Ltd.', price: 234.80, sector: 'Metals' },
  { symbol: 'COALINDIA', name: 'Coal India Ltd.', price: 345.90, sector: 'Mining' },
  
  // Energy & Oil
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd.', price: 234.50, sector: 'Energy' },
  { symbol: 'IOC', name: 'Indian Oil Corporation Ltd.', price: 123.75, sector: 'Energy' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.', price: 345.25, sector: 'Energy' },
  { symbol: 'HPCL', name: 'Hindustan Petroleum Corporation Ltd.', price: 278.90, sector: 'Energy' },
  { symbol: 'GAIL', name: 'GAIL (India) Ltd.', price: 156.45, sector: 'Energy' },
  
  // FMCG
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.', price: 4567.25, sector: 'FMCG' },
  { symbol: 'DABUR', name: 'Dabur India Ltd.', price: 567.80, sector: 'FMCG' },
  { symbol: 'MARICO', name: 'Marico Ltd.', price: 456.90, sector: 'FMCG' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd.', price: 1234.60, sector: 'FMCG' },
  { symbol: 'COLPAL', name: 'Colgate Palmolive (India) Ltd.', price: 2345.75, sector: 'FMCG' },
  
  // Telecom
  { symbol: 'JIO', name: 'Reliance Jio Infocomm Ltd.', price: 89.45, sector: 'Telecom' },
  { symbol: 'IDEA', name: 'Vodafone Idea Ltd.', price: 12.35, sector: 'Telecom' },
  
  // Cement
  { symbol: 'SHREECEM', name: 'Shree Cement Ltd.', price: 23456.80, sector: 'Cement' },
  { symbol: 'AMBUJACEM', name: 'Ambuja Cements Ltd.', price: 456.75, sector: 'Cement' },
  { symbol: 'ACC', name: 'ACC Ltd.', price: 2234.60, sector: 'Cement' },
  
  // Real Estate
  { symbol: 'DLF', name: 'DLF Ltd.', price: 567.25, sector: 'Real Estate' },
  { symbol: 'GODREJPROP', name: 'Godrej Properties Ltd.', price: 1789.45, sector: 'Real Estate' },
  { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Ltd.', price: 1234.80, sector: 'Real Estate' },
  
  // Power
  { symbol: 'NTPC', name: 'NTPC Ltd.', price: 234.60, sector: 'Power' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.', price: 267.45, sector: 'Power' },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd.', price: 345.80, sector: 'Power' },
  
  // Airlines
  { symbol: 'INDIGO', name: 'InterGlobe Aviation Ltd.', price: 3456.75, sector: 'Airlines' },
  { symbol: 'SPICEJET', name: 'SpiceJet Ltd.', price: 67.45, sector: 'Airlines' },
  
  // Retail
  { symbol: 'DMART', name: 'Avenue Supermarts Ltd.', price: 4567.90, sector: 'Retail' },
  { symbol: 'TRENT', name: 'Trent Ltd.', price: 2345.60, sector: 'Retail' },
  
  // Insurance
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd.', price: 1456.75, sector: 'Insurance' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd.', price: 678.90, sector: 'Insurance' },
  { symbol: 'ICICIPRULI', name: 'ICICI Prudential Life Insurance Company Ltd.', price: 567.25, sector: 'Insurance' },
  
  // Mid & Small Cap Stocks (Add more to reach 500+)
  { symbol: 'ZOMATO', name: 'Zomato Ltd.', price: 156.75, sector: 'Food Tech' },
  { symbol: 'PAYTM', name: 'One 97 Communications Ltd.', price: 789.45, sector: 'Fintech' },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd.', price: 234.60, sector: 'E-commerce' },
  { symbol: 'POLICYBZR', name: 'PB Fintech Ltd.', price: 1234.50, sector: 'Fintech' },
  { symbol: 'CARTRADE', name: 'CarTrade Tech Ltd.', price: 567.80, sector: 'Auto Tech' },
];

// Generate base stock data and prices from the comprehensive list
const baseStockData: Record<string, Omit<StockData, 'price' | 'change' | 'changePercent'>> = {};
const basePrices: Record<string, number> = {};

indianStocks.forEach(stock => {
  baseStockData[stock.symbol] = {
    symbol: stock.symbol,
    name: stock.name,
    volume: `${(Math.random() * 5 + 0.5).toFixed(1)}M`,
    marketCap: `${(Math.random() * 20 + 1).toFixed(1)}L Cr`,
    high: stock.price * 1.02,
    low: stock.price * 0.98,
    open: stock.price * (0.99 + Math.random() * 0.02)
  };
  basePrices[stock.symbol] = stock.price;
});

// Generate live stock data
const generateStockData = (symbol: string): StockData => {
  const baseData = baseStockData[symbol];
  const basePrice = basePrices[symbol];
  
  if (!baseData || !basePrice) {
    return baseStockData['RELIANCE'] as StockData;
  }
  
  const priceData = generateRealtimePrice(basePrice, symbol);
  
  return {
    ...baseData,
    ...priceData
  };
};

export const stockApi = {
  // Get real-time stock quote with live prices
  async getQuote(symbol: string): Promise<StockData> {
    try {
      const { backendApi } = await import('@/services/backendApi');
      return await backendApi.getStock(symbol);
    } catch (error) {
      console.log('Using live simulation for', symbol);
      return generateStockData(symbol.toUpperCase());
    }
  },

  // Get multiple stock quotes
  async getMultipleQuotes(symbols: string[]): Promise<StockData[]> {
    const promises = symbols.map(symbol => this.getQuote(symbol));
    return Promise.all(promises);
  },

  // Search stocks
  async searchStocks(keyword: string): Promise<Array<{symbol: string, name: string}>> {
    return indianStocks
      .filter(stock => 
        stock.symbol.toLowerCase().includes(keyword.toLowerCase()) ||
        stock.name.toLowerCase().includes(keyword.toLowerCase())
      )
      .map(stock => ({ symbol: stock.symbol, name: stock.name }))
      .slice(0, 20);
  },

  // Get trending stocks with live prices
  async getTrendingStocks(): Promise<StockData[]> {
    try {
      const { backendApi } = await import('@/services/backendApi');
      return await backendApi.getTrendingStocks();
    } catch (error) {
      console.log('Using live simulation for trending stocks');
      // Rotate through different trending stocks
      const trendingSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN', 'BHARTIARTL', 'KOTAKBANK'];
      const randomTrending = trendingSymbols.sort(() => 0.5 - Math.random()).slice(0, 6);
      return Promise.all(randomTrending.map(symbol => generateStockData(symbol)));
    }
  },

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