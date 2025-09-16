const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin
// IMPORTANT: Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// to the path of your service account key file.
// For example: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/key.json"
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const app = express();
const PORT = 3002;

// Middleware
const corsOptions = {
  origin: 'http://localhost:8080', // Allow only the frontend to connect
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

let stockPrices = {};

// Fetch prices from Firestore
const fetchPricesFromFirestore = async () => {
  try {
    const stocksCollection = db.collection('stocks');
    const snapshot = await stocksCollection.get();
    const prices = {};
    snapshot.forEach(doc => {
      prices[doc.id] = doc.data();
    });
    stockPrices = prices;
    console.log('Successfully fetched stock prices from Firestore:', stockPrices);
  } catch (error) {
    console.error('Error fetching stock prices from Firestore:', error);
  }
};

// Fetch prices on startup and then every 5 minutes
fetchPricesFromFirestore();
setInterval(fetchPricesFromFirestore, 5 * 60 * 1000);

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

const getStockData = (symbol) => {
  const stock = stockPrices[symbol] || stockPrices[Object.keys(stockPrices)[0]];
  if (!stock) {
    return { error: 'Stock not found' };
  }
  const priceData = generateLivePrice(stock.price, symbol);
  
  return { ...stock, ...priceData };
};

// Routes
app.get('/api/prices', (req, res) => {
  const simulatedPrices = {};
  for (const symbol in stockPrices) {
    simulatedPrices[symbol] = getStockData(symbol);
  }
  console.log('Sending simulated prices:', simulatedPrices);
  res.json(simulatedPrices);
});

// Get stock quote with live prices
app.get('/api/stocks/:symbol', (req, res) => {
  const { symbol } = req.params;
  const stock = getStockData(symbol.toUpperCase());
  res.json(stock);
});

// Get trending stocks with live prices
app.get('/api/stocks', (req, res) => {
  const allSymbols = Object.keys(stockPrices);
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
});
