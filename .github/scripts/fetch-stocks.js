const axios = require('axios');
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Top 50 Indian stocks + 5 indices
const SYMBOLS = [
  'RELIANCE.BSE', 'TCS.BSE', 'HDFCBANK.BSE', 'INFY.BSE', 'HINDUNILVR.BSE',
  'ICICIBANK.BSE', 'KOTAKBANK.BSE', 'BHARTIARTL.BSE', 'ITC.BSE', 'SBIN.BSE',
  'ASIANPAINT.BSE', 'MARUTI.BSE', 'AXISBANK.BSE', 'LT.BSE', 'HCLTECH.BSE',
  'WIPRO.BSE', 'ULTRACEMCO.BSE', 'TITAN.BSE', 'NESTLEIND.BSE', 'BAJFINANCE.BSE',
  'POWERGRID.BSE', 'NTPC.BSE', 'TECHM.BSE', 'ONGC.BSE', 'TATAMOTORS.BSE',
  'SUNPHARMA.BSE', 'JSWSTEEL.BSE', 'TATASTEEL.BSE', 'INDUSINDBK.BSE', 'ADANIPORTS.BSE',
  'COALINDIA.BSE', 'GRASIM.BSE', 'CIPLA.BSE', 'DRREDDY.BSE', 'EICHERMOT.BSE',
  'BAJAJFINSV.BSE', 'BRITANNIA.BSE', 'DIVISLAB.BSE', 'HEROMOTOCO.BSE', 'SHREECEM.BSE',
  'APOLLOHOSP.BSE', 'PIDILITIND.BSE', 'BPCL.BSE', 'IOC.BSE', 'HINDALCO.BSE',
  'VEDL.BSE', 'GODREJCP.BSE', 'DABUR.BSE', 'MARICO.BSE', 'COLPAL.BSE',
  // Indices
  'BSE:SENSEX', 'NSE:NIFTY', 'BSE:BSE100', 'NSE:BANKNIFTY', 'NSE:FINNIFTY'
];

async function fetchStockPrice(symbol) {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: API_KEY
      }
    });
    
    const quote = response.data['Global Quote'];
    if (!quote) return null;
    
    return {
      symbol: symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    return null;
  }
}

async function updateFirestore(stockData) {
  const batch = db.batch();
  
  stockData.forEach(stock => {
    if (stock) {
      const docRef = db.collection('stocks').doc(stock.symbol);
      batch.set(docRef, stock, { merge: true });
    }
  });
  
  await batch.commit();
  console.log('Updated Firestore with stock prices');
}

async function main() {
  console.log('Starting stock price fetch...');
  
  const stockPromises = SYMBOLS.map((symbol, index) => 
    new Promise(resolve => {
      setTimeout(() => {
        fetchStockPrice(symbol).then(resolve);
      }, index * 12000); // 12 second delay between calls
    })
  );
  
  const stockData = await Promise.all(stockPromises);
  const validStocks = stockData.filter(stock => stock !== null);
  
  if (validStocks.length > 0) {
    await updateFirestore(validStocks);
    console.log(`Successfully updated ${validStocks.length} stocks`);
  }
  
  process.exit(0);
}

main().catch(console.error);