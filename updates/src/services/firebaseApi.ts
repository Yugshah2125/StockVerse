import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { db, auth } from './firebase';
import { calculateLevelInfo, checkLevelUp } from '../utils/levelSystem';

export const firebaseApi = {
  // Auth
  async register(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: email.split('@')[0],
      virtualCash: 1000000,
      level: 1,
      xp: 0,
      createdAt: serverTimestamp()
    });
    
    return { 
      user: { 
        id: user.uid, 
        email: user.email, 
        name: email.split('@')[0], 
        virtualCash: 1000000, 
        level: 1, 
        xp: 0,
        streak: 0
      } 
    };
  },

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    
    return { 
      user: { 
        id: user.uid, 
        email: userData?.email,
        name: userData?.name,
        virtualCash: userData?.virtualCash || 1000000,
        level: userData?.level || 1,
        xp: userData?.xp || 0,
        streak: userData?.streak || 0
      } 
    };
  },

  async logout() {
    await signOut(auth);
  },

  // Portfolio
  async getPortfolio(userId: string) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    
    const holdingsQuery = query(collection(db, 'holdings'), where('userId', '==', userId));
    const holdingsSnapshot = await getDocs(holdingsQuery);
    
    // Get current stock prices and calculate portfolio
    const holdings = [];
    let totalHoldingsValue = 0;
    let totalInvested = 0;
    
    for (const holdingDoc of holdingsSnapshot.docs) {
      const holdingData = holdingDoc.data();
      
      // Get current stock price (simulate live price)
      const now = Date.now();
      const seed = Math.sin(now / 10000 + holdingData.symbol.length) * Math.cos(now / 5000);
      const basePrices = {
        'RELIANCE': 2456.75,
        'TCS': 3542.80,
        'INFY': 1456.30,
        'HDFCBANK': 1678.45
      };
      const basePrice = basePrices[holdingData.symbol] || 2000;
      const variation = seed * 0.05;
      const currentPrice = basePrice * (1 + variation);
      
      const totalValue = holdingData.shares * currentPrice;
      const invested = holdingData.shares * holdingData.avgPrice;
      const totalReturn = totalValue - invested;
      const returnPercent = (totalReturn / invested) * 100;
      
      holdings.push({
        id: holdingDoc.id,
        symbol: holdingData.symbol,
        shares: holdingData.shares,
        avgPrice: holdingData.avgPrice,
        currentPrice: parseFloat(currentPrice.toFixed(2)),
        totalValue: parseFloat(totalValue.toFixed(2)),
        totalReturn: parseFloat(totalReturn.toFixed(2)),
        returnPercent: parseFloat(returnPercent.toFixed(2))
      });
      
      totalHoldingsValue += totalValue;
      totalInvested += invested;
    }
    
    const cash = userData?.virtualCash || 0;
    const totalPortfolioValue = cash + totalHoldingsValue;
    const totalPortfolioReturn = totalHoldingsValue - totalInvested;
    const totalReturnPercent = totalInvested > 0 ? (totalPortfolioReturn / totalInvested) * 100 : 0;
    
    return {
      cash,
      holdings,
      totalValue: parseFloat(totalPortfolioValue.toFixed(2)),
      totalReturn: parseFloat(totalPortfolioReturn.toFixed(2)),
      returnPercent: parseFloat(totalReturnPercent.toFixed(2)),
      dailyChange: parseFloat((totalPortfolioReturn * 0.1).toFixed(2)), // Mock daily change
      dailyChangePercent: parseFloat((totalReturnPercent * 0.1).toFixed(2))
    };
  },

  // Trading
  async buyStock(userId: string, symbol: string, shares: number, price: number) {
    const total = shares * price;
    
    // Update user cash and XP
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const currentCash = userData?.virtualCash || 0;
    const currentXP = userData?.xp || 0;
    const currentLevel = userData?.level || 1;
    
    if (total > currentCash) {
      throw new Error('Insufficient funds');
    }
    
    // Add XP for trading (10 XP per trade)
    const newXP = currentXP + 10;
    const levelInfo = calculateLevelInfo(newXP);
    const levelUpResult = checkLevelUp(currentXP, newXP);
    
    await updateDoc(userRef, {
      virtualCash: currentCash - total,
      xp: newXP,
      level: levelInfo.level
    });
    
    // Add/update holding
    const holdingsQuery = query(
      collection(db, 'holdings'), 
      where('userId', '==', userId),
      where('symbol', '==', symbol)
    );
    const holdingsSnapshot = await getDocs(holdingsQuery);
    
    if (holdingsSnapshot.empty) {
      // New holding
      await addDoc(collection(db, 'holdings'), {
        userId,
        symbol,
        shares,
        avgPrice: price
      });
    } else {
      // Update existing holding
      const holdingDoc = holdingsSnapshot.docs[0];
      const holdingData = holdingDoc.data();
      const newShares = holdingData.shares + shares;
      const newAvgPrice = ((holdingData.shares * holdingData.avgPrice) + total) / newShares;
      
      await updateDoc(doc(db, 'holdings', holdingDoc.id), {
        shares: newShares,
        avgPrice: newAvgPrice
      });
    }
    
    // Add trade record
    await addDoc(collection(db, 'trades'), {
      userId,
      symbol,
      type: 'buy',
      shares,
      price,
      total,
      timestamp: serverTimestamp()
    });
    
    return { 
      success: true, 
      message: `Successfully bought ${shares} shares of ${symbol}`,
      levelUp: levelUpResult
    };
  },

  async sellStock(userId: string, symbol: string, shares: number, price: number) {
    const total = shares * price;
    
    // Check holding
    const holdingsQuery = query(
      collection(db, 'holdings'), 
      where('userId', '==', userId),
      where('symbol', '==', symbol)
    );
    const holdingsSnapshot = await getDocs(holdingsQuery);
    
    if (holdingsSnapshot.empty) {
      throw new Error('No shares to sell');
    }
    
    const holdingDoc = holdingsSnapshot.docs[0];
    const holdingData = holdingDoc.data();
    
    if (holdingData.shares < shares) {
      throw new Error('Insufficient shares');
    }
    
    // Update user cash and XP
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const currentCash = userData?.virtualCash || 0;
    const currentXP = userData?.xp || 0;
    const currentLevel = userData?.level || 1;
    
    // Add XP for trading (10 XP per trade)
    const newXP = currentXP + 10;
    const levelInfo = calculateLevelInfo(newXP);
    const levelUpResult = checkLevelUp(currentXP, newXP);
    
    await updateDoc(userRef, {
      virtualCash: currentCash + total,
      xp: newXP,
      level: levelInfo.level
    });
    
    // Update holding
    const newShares = holdingData.shares - shares;
    if (newShares === 0) {
      // Delete holding
      await updateDoc(doc(db, 'holdings', holdingDoc.id), {
        shares: 0
      });
    } else {
      await updateDoc(doc(db, 'holdings', holdingDoc.id), {
        shares: newShares
      });
    }
    
    // Add trade record
    await addDoc(collection(db, 'trades'), {
      userId,
      symbol,
      type: 'sell',
      shares,
      price,
      total,
      timestamp: serverTimestamp()
    });
    
    return { 
      success: true, 
      message: `Successfully sold ${shares} shares of ${symbol}`,
      levelUp: levelUpResult
    };
  }
};