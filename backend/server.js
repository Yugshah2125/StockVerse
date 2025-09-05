const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Live stock data with real-time price simulation
const generateLivePrice = (basePrice, symbol) => {
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

const basePrices = {
  'RELIANCE': 2456.75,
  'TCS': 3542.80,
  'INFY': 1456.30,
  'HDFCBANK': 1678.45
};

// Import the comprehensive stock data
const indianStocks = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2456.75 },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 3542.80 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1678.45 },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: 1456.30 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1089.60 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', price: 2387.90 },
  { symbol: 'ITC', name: 'ITC Ltd.', price: 456.75 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 623.45 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1234.50 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', price: 1789.25 }
];

const stockDatabase = {};
const priceDatabase = {};

indianStocks.forEach(stock => {
  stockDatabase[stock.symbol] = {
    symbol: stock.symbol,
    name: stock.name,
    volume: `${(Math.random() * 5 + 0.5).toFixed(1)}M`,
    high: stock.price * 1.02,
    low: stock.price * 0.98,
    open: stock.price * (0.99 + Math.random() * 0.02)
  };
  priceDatabase[stock.symbol] = stock.price;
});

const getStockData = (symbol) => {
  const base = stockDatabase[symbol] || stockDatabase['RELIANCE'];
  const basePrice = priceDatabase[symbol] || priceDatabase['RELIANCE'];
  const priceData = generateLivePrice(basePrice, symbol);
  
  return { ...base, ...priceData };
};

// Routes

// Get stock quote with live prices
app.get('/api/stocks/:symbol', (req, res) => {
  const { symbol } = req.params;
  const stock = getStockData(symbol.toUpperCase());
  res.json(stock);
});

// Get trending stocks with live prices
app.get('/api/stocks', (req, res) => {
  const allSymbols = Object.keys(stockDatabase);
  const randomTrending = allSymbols.sort(() => 0.5 - Math.random()).slice(0, 6);
  const trending = randomTrending.map(symbol => getStockData(symbol));
  res.json(trending);
});

// All other endpoints return empty/error responses
app.post('/api/register', (req, res) => {
  res.status(501).json({ error: 'Database not configured' });
});

app.post('/api/login', (req, res) => {
  res.status(501).json({ error: 'Database not configured' });
});

app.get('/api/portfolio', (req, res) => {
  res.status(501).json({ error: 'Database not configured' });
});

app.post('/api/trade/buy', (req, res) => {
  res.status(501).json({ error: 'Database not configured' });
});

app.post('/api/trade/sell', (req, res) => {
  res.status(501).json({ error: 'Database not configured' });
});

app.listen(PORT, () => {
  console.log(`🚀 StockVerse Backend running on http://localhost:${PORT}`);
  console.log('⚠️  Only stock data API available - Database not configured');
});