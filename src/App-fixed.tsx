import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Simple fallback components
const SimpleAuth = () => (
  <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">StockVerse</h1>
      <p className="text-xl mb-6">Virtual Trading Platform</p>
      <div className="space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-3 rounded bg-slate-800 border border-slate-700"
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-3 rounded bg-slate-800 border border-slate-700"
        />
        <button 
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
          onClick={() => window.location.href = '/dashboard'}
        >
          Sign In
        </button>
      </div>
    </div>
  </div>
);

const SimpleDashboard = () => (
  <div className="min-h-screen bg-slate-900 text-white p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Portfolio Value</h3>
          <p className="text-2xl text-green-400">₹10,00,000</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Today's P&L</h3>
          <p className="text-2xl text-red-400">-₹5,000</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Active Trades</h3>
          <p className="text-2xl">12</p>
        </div>
      </div>
      <div className="mt-8">
        <button 
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          onClick={() => window.location.href = '/'}
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleAuth />} />
        <Route path="/auth" element={<SimpleAuth />} />
        <Route path="/dashboard" element={<SimpleDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;