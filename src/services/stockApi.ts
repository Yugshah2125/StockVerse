import { alphaVantageApi } from './alphaVantageApi';

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



// Generate price data using Alpha Vantage baseline + simulation
const generatePriceData = (symbol: string) => {
  const currentPrice = alphaVantageApi.getSimulatedPrice(symbol);
  const basePrice = alphaVantageApi.getBaselinePrice(symbol);
  const change = currentPrice - basePrice;
  const changePercent = basePrice > 0 ? (change / basePrice) * 100 : 0;

  return {
    price: parseFloat(currentPrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2))
  };
};

// Indian stocks database
const indianStocks = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
  { symbol: 'INFY', name: 'Infosys Ltd.' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
  { symbol: 'ITC', name: 'ITC Ltd.' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.' },
  { symbol: 'WIPRO', name: 'Wipro Ltd.' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.' },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd.' },
  { symbol: 'TITAN', name: 'Titan Company Ltd.' },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda' },
  { symbol: 'PNB', name: 'Punjab National Bank' },
  { symbol: 'CANBK', name: 'Canara Bank' },
  { symbol: 'UNIONBANK', name: 'Union Bank of India' },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd.' },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd.' },
  { symbol: 'LTIM', name: 'LTIMindtree Ltd.' },
  { symbol: 'MPHASIS', name: 'Mphasis Ltd.' },
  { symbol: 'COFORGE', name: 'Coforge Ltd.' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.' },
  { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories Ltd.' },
  { symbol: 'CIPLA', name: 'Cipla Ltd.' },
  { symbol: 'BIOCON', name: 'Biocon Ltd.' },
  { symbol: 'LUPIN', name: 'Lupin Ltd.' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.' },
  { symbol: 'VEDL', name: 'Vedanta Ltd.' },
  { symbol: 'COALINDIA', name: 'Coal India Ltd.' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd.' },
  { symbol: 'IOC', name: 'Indian Oil Corporation Ltd.' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.' },
  { symbol: 'HPCL', name: 'Hindustan Petroleum Corporation Ltd.' },
  { symbol: 'GAIL', name: 'GAIL (India) Ltd.' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.' },
  { symbol: 'DABUR', name: 'Dabur India Ltd.' },
  { symbol: 'MARICO', name: 'Marico Ltd.' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd.' },
  { symbol: 'COLPAL', name: 'Colgate Palmolive (India) Ltd.' },
  { symbol: 'JIO', name: 'Reliance Jio Infocomm Ltd.' },
  { symbol: 'IDEA', name: 'Vodafone Idea Ltd.' },
  { symbol: 'SHREECEM', name: 'Shree Cement Ltd.' },
  { symbol: 'AMBUJACEM', name: 'Ambuja Cements Ltd.' },
  { symbol: 'ACC', name: 'ACC Ltd.' },
  { symbol: 'DLF', name: 'DLF Ltd.' },
  { symbol: 'GODREJPROP', name: 'Godrej Properties Ltd.' },
  { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Ltd.' },
  { symbol: 'NTPC', name: 'NTPC Ltd.' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.' },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd.' },
  { symbol: 'INDIGO', name: 'InterGlobe Aviation Ltd.' },
  { symbol: 'SPICEJET', name: 'SpiceJet Ltd.' },
  { symbol: 'DMART', name: 'Avenue Supermarts Ltd.' },
  { symbol: 'TRENT', name: 'Trent Ltd.' },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd.' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd.' },
  { symbol: 'ICICIPRULI', name: 'ICICI Prudential Life Insurance Company Ltd.' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd.' },
  { symbol: 'PAYTM', name: 'One 97 Communications Ltd.' },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd.' },
  { symbol: 'POLICYBZR', name: 'PB Fintech Ltd.' },
  { symbol: 'CARTRADE', name: 'CarTrade Tech Ltd.' }
];

// Generate stock data
const generateStockData = (symbol: string): StockData => {
  const stock = indianStocks.find(s => s.symbol === symbol);
  
  if (!stock) {
    // Handle index funds
    if (['NIFTY50', 'NIFTYBANK', 'NIFTYIT', 'SENSEX', 'NIFTYMIDCAP'].includes(symbol)) {
      const indexNames = {
        'NIFTY50': 'NIFTY 50 Index Fund',
        'NIFTYBANK': 'NIFTY Bank Index Fund', 
        'NIFTYIT': 'NIFTY IT Index Fund',
        'SENSEX': 'BSE SENSEX Index Fund',
        'NIFTYMIDCAP': 'NIFTY MidCap Index Fund'
      };
      
      const priceData = generatePriceData(symbol);
      return {
        symbol,
        name: indexNames[symbol] || `${symbol} Index Fund`,
        volume: `${(Math.random() * 10 + 5).toFixed(1)}M`,
        marketCap: `${(Math.random() * 50 + 10).toFixed(1)}L Cr`,
        high: priceData.price * 1.005,
        low: priceData.price * 0.995,
        open: priceData.price * (0.999 + Math.random() * 0.002),
        ...priceData
      };
    }
    
    return generateStockData('RELIANCE');
  }
  
  const priceData = generatePriceData(symbol);
  
  return {
    symbol: stock.symbol,
    name: stock.name,
    volume: `${(Math.random() * 5 + 0.5).toFixed(1)}M`,
    marketCap: `${(Math.random() * 20 + 1).toFixed(1)}L Cr`,
    high: priceData.price * 1.02,
    low: priceData.price * 0.98,
    open: priceData.price * (0.99 + Math.random() * 0.02),
    ...priceData
  };
};

export const stockApi = {
  async getQuote(symbol: string): Promise<StockData> {
    return generateStockData(symbol.toUpperCase());
  },

  async getMultipleQuotes(symbols: string[]): Promise<StockData[]> {
    return symbols.map(symbol => generateStockData(symbol));
  },

  async searchStocks(keyword: string): Promise<Array<{symbol: string, name: string}>> {
    return indianStocks
      .filter(stock => 
        stock.symbol.toLowerCase().includes(keyword.toLowerCase()) ||
        stock.name.toLowerCase().includes(keyword.toLowerCase())
      )
      .map(stock => ({ symbol: stock.symbol, name: stock.name }))
      .slice(0, 20);
  },

  async getTrendingStocks(): Promise<StockData[]> {
    const trendingSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'ZOMATO'];
    return trendingSymbols.map(symbol => generateStockData(symbol));
  }
};