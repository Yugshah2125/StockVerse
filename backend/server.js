const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3002;
const JWT_SECRET = 'stockverse-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./stockverse.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    virtual_cash REAL DEFAULT 1000000,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Holdings table
  db.run(`CREATE TABLE IF NOT EXISTS holdings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    symbol TEXT,
    shares INTEGER,
    avg_price REAL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Trades table
  db.run(`CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    symbol TEXT,
    type TEXT,
    shares INTEGER,
    price REAL,
    total REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

// Mock stock data
const mockStocks = {
  'RELIANCE': { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2456.75, change: 32.50, changePercent: 1.34, volume: '2.1M', high: 2478.90, low: 2445.20, open: 2450.00 },
  'TCS': { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 3542.80, change: -15.25, changePercent: -0.43, volume: '1.8M', high: 3565.40, low: 3535.10, open: 3558.05 },
  'INFY': { symbol: 'INFY', name: 'Infosys Ltd.', price: 1456.30, change: 18.75, changePercent: 1.30, volume: '3.2M', high: 1465.80, low: 1442.50, open: 1448.90 },
  'HDFCBANK': { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1678.45, change: 12.30, changePercent: 0.74, volume: '2.5M', high: 1685.20, low: 1665.80, open: 1670.15 }
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const name = email.split('@')[0];
    
    db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', 
      [email, hashedPassword, name], 
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'User already exists' });
        }
        
        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET);
        res.json({ 
          token, 
          user: { id: this.lastID, email, name, virtualCash: 1000000, level: 1, xp: 0 }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        virtualCash: user.virtual_cash, 
        level: user.level, 
        xp: user.xp 
      }
    });
  });
});

// Get stock quote
app.get('/api/stocks/:symbol', (req, res) => {
  const { symbol } = req.params;
  const stock = mockStocks[symbol.toUpperCase()] || mockStocks['RELIANCE'];
  res.json(stock);
});

// Get trending stocks
app.get('/api/stocks', (req, res) => {
  const trending = Object.values(mockStocks).slice(0, 4);
  res.json(trending);
});

// Get portfolio
app.get('/api/portfolio', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  db.get('SELECT virtual_cash FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    
    db.all('SELECT * FROM holdings WHERE user_id = ?', [userId], (err, holdings) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      
      const portfolio = {
        cash: user.virtual_cash,
        holdings: holdings.map(h => ({
          symbol: h.symbol,
          shares: h.shares,
          avgPrice: h.avg_price,
          currentPrice: mockStocks[h.symbol]?.price || h.avg_price,
          totalValue: h.shares * (mockStocks[h.symbol]?.price || h.avg_price),
          totalReturn: (h.shares * (mockStocks[h.symbol]?.price || h.avg_price)) - (h.shares * h.avg_price),
          returnPercent: (((mockStocks[h.symbol]?.price || h.avg_price) - h.avg_price) / h.avg_price) * 100
        })),
        totalValue: 0,
        totalReturn: 0,
        returnPercent: 0
      };
      
      const holdingsValue = portfolio.holdings.reduce((sum, h) => sum + h.totalValue, 0);
      portfolio.totalValue = portfolio.cash + holdingsValue;
      portfolio.totalReturn = portfolio.totalValue - 1000000;
      portfolio.returnPercent = (portfolio.totalReturn / 1000000) * 100;
      
      res.json(portfolio);
    });
  });
});

// Buy stock
app.post('/api/trade/buy', authenticateToken, (req, res) => {
  const { symbol, shares } = req.body;
  const userId = req.user.id;
  const stock = mockStocks[symbol.toUpperCase()];
  
  if (!stock) {
    return res.status(400).json({ error: 'Stock not found' });
  }
  
  const total = shares * stock.price;
  
  db.get('SELECT virtual_cash FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) return res.status(500).json({ error: 'Server error' });
    
    if (total > user.virtual_cash) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }
    
    // Update cash
    db.run('UPDATE users SET virtual_cash = virtual_cash - ? WHERE id = ?', [total, userId]);
    
    // Add/update holding
    db.get('SELECT * FROM holdings WHERE user_id = ? AND symbol = ?', [userId, symbol], (err, holding) => {
      if (holding) {
        const newShares = holding.shares + shares;
        const newAvgPrice = ((holding.shares * holding.avg_price) + total) / newShares;
        db.run('UPDATE holdings SET shares = ?, avg_price = ? WHERE id = ?', [newShares, newAvgPrice, holding.id]);
      } else {
        db.run('INSERT INTO holdings (user_id, symbol, shares, avg_price) VALUES (?, ?, ?, ?)', 
          [userId, symbol, shares, stock.price]);
      }
    });
    
    // Add trade record
    db.run('INSERT INTO trades (user_id, symbol, type, shares, price, total) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, symbol, 'buy', shares, stock.price, total]);
    
    res.json({ success: true, message: `Successfully bought ${shares} shares of ${symbol}` });
  });
});

// Sell stock
app.post('/api/trade/sell', authenticateToken, (req, res) => {
  const { symbol, shares } = req.body;
  const userId = req.user.id;
  const stock = mockStocks[symbol.toUpperCase()];
  
  if (!stock) {
    return res.status(400).json({ error: 'Stock not found' });
  }
  
  db.get('SELECT * FROM holdings WHERE user_id = ? AND symbol = ?', [userId, symbol], (err, holding) => {
    if (err || !holding || holding.shares < shares) {
      return res.status(400).json({ error: 'Insufficient shares' });
    }
    
    const total = shares * stock.price;
    
    // Update cash
    db.run('UPDATE users SET virtual_cash = virtual_cash + ? WHERE id = ?', [total, userId]);
    
    // Update holding
    const newShares = holding.shares - shares;
    if (newShares === 0) {
      db.run('DELETE FROM holdings WHERE id = ?', [holding.id]);
    } else {
      db.run('UPDATE holdings SET shares = ? WHERE id = ?', [newShares, holding.id]);
    }
    
    // Add trade record
    db.run('INSERT INTO trades (user_id, symbol, type, shares, price, total) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, symbol, 'sell', shares, stock.price, total]);
    
    res.json({ success: true, message: `Successfully sold ${shares} shares of ${symbol}` });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 StockVerse Backend running on http://localhost:${PORT}`);
});