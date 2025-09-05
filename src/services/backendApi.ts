const API_BASE = 'http://localhost:3002/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

// API headers with auth
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const backendApi = {
  // Auth
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  async register(email: string, password: string) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  // Stocks
  async getStock(symbol: string) {
    const response = await fetch(`${API_BASE}/stocks/${symbol}`);
    return response.json();
  },

  async getTrendingStocks() {
    const response = await fetch(`${API_BASE}/stocks`);
    return response.json();
  },

  // Portfolio
  async getPortfolio() {
    const response = await fetch(`${API_BASE}/portfolio`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Trading
  async buyStock(symbol: string, shares: number) {
    const response = await fetch(`${API_BASE}/trade/buy`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ symbol, shares })
    });
    return response.json();
  },

  async sellStock(symbol: string, shares: number) {
    const response = await fetch(`${API_BASE}/trade/sell`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ symbol, shares })
    });
    return response.json();
  }
};