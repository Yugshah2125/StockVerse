import { 
  collection, doc, setDoc, getDoc, updateDoc, addDoc, query, where, getDocs, serverTimestamp 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { alphaVantageApi } from './alphaVantageApi';

export const firebaseApi = {
  // Auth
  async register(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
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
        streak: 0,
        createdAt: new Date().toISOString()
      } 
    };
  },

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
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
        streak: userData?.streak || 0,
        createdAt: userData?.createdAt?.toDate?.()?.toISOString() || userData?.createdAt
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
    
    const holdings = [];
    let totalHoldingsValue = 0;
    let totalInvested = 0;
    let previousDayValue = 0;
    
    for (const holdingDoc of holdingsSnapshot.docs) {
      const holdingData = holdingDoc.data();
      
      if (holdingData.shares <= 0) continue;
      
      const currentPrice = alphaVantageApi.getSimulatedPrice(holdingData.symbol);
      const previousPrice = alphaVantageApi.getBaselinePrice(holdingData.symbol);
      const totalValue = holdingData.shares * currentPrice;
      const previousValue = holdingData.shares * previousPrice;
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
      previousDayValue += previousValue;
      totalInvested += invested;
    }
    
    const cash = userData?.virtualCash || 0;
    const totalPortfolioValue = cash + totalHoldingsValue;
    const previousPortfolioValue = cash + previousDayValue;
    const totalPortfolioReturn = totalHoldingsValue - totalInvested;
    const totalReturnPercent = totalInvested > 0 ? (totalPortfolioReturn / totalInvested) * 100 : 0;
    
    // Calculate real daily P&L
    const dailyChange = totalPortfolioValue - previousPortfolioValue;
    const dailyChangePercent = previousPortfolioValue > 0 ? (dailyChange / previousPortfolioValue) * 100 : 0;
    
    return {
      cash,
      holdings,
      totalValue: parseFloat(totalPortfolioValue.toFixed(2)),
      totalReturn: parseFloat(totalPortfolioReturn.toFixed(2)),
      returnPercent: parseFloat(totalReturnPercent.toFixed(2)),
      dailyChange: parseFloat(dailyChange.toFixed(2)),
      dailyChangePercent: parseFloat(dailyChangePercent.toFixed(2))
    };
  },

  // Trading
  async buyStock(userId: string, symbol: string, shares: number, price: number) {
    const total = shares * price;
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const currentCash = userData?.virtualCash || 0;
    
    if (total > currentCash) {
      return { success: false, message: `Insufficient funds. Need ₭${total.toLocaleString()}, have ₭${currentCash.toLocaleString()}` };
    }
    
    // Award XP for trading
    const { xpService } = await import('./xpService');
    const xpResult = await xpService.awardXP(userId, {
      amount: 10,
      reason: `Bought ${shares} shares of ${symbol}`,
      category: 'trading'
    });
    
    await updateDoc(userRef, {
      virtualCash: currentCash - total
    });
    
    const holdingsQuery = query(collection(db, 'holdings'), where('userId', '==', userId), where('symbol', '==', symbol));
    const holdingsSnapshot = await getDocs(holdingsQuery);
    
    if (holdingsSnapshot.empty) {
      await addDoc(collection(db, 'holdings'), { userId, symbol, shares, avgPrice: price });
    } else {
      const holdingDoc = holdingsSnapshot.docs[0];
      const holdingData = holdingDoc.data();
      const newShares = holdingData.shares + shares;
      const newAvgPrice = ((holdingData.shares * holdingData.avgPrice) + total) / newShares;
      
      await updateDoc(doc(db, 'holdings', holdingDoc.id), { shares: newShares, avgPrice: newAvgPrice });
    }
    
    await addDoc(collection(db, 'trades'), {
      userId, symbol, type: 'buy', shares, price, total, timestamp: serverTimestamp()
    });
    
    return { 
      success: true, 
      message: `Successfully bought ${shares} shares of ${symbol}`,
      trade: { id: Date.now().toString(), userId, symbol, type: 'buy', shares, price, total, timestamp: new Date() }
    };
  },

  async sellStock(userId: string, symbol: string, shares: number, price: number) {
    const total = shares * price;
    
    const holdingsQuery = query(collection(db, 'holdings'), where('userId', '==', userId), where('symbol', '==', symbol));
    const holdingsSnapshot = await getDocs(holdingsQuery);
    
    if (holdingsSnapshot.empty) throw new Error('No shares to sell');
    
    const holdingDoc = holdingsSnapshot.docs[0];
    const holdingData = holdingDoc.data();
    
    if (holdingData.shares < shares) throw new Error('Insufficient shares');
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const currentCash = userData?.virtualCash || 0;
    // Award XP for trading
    const { xpService } = await import('./xpService');
    const xpResult = await xpService.awardXP(userId, {
      amount: 10,
      reason: `Sold ${shares} shares of ${symbol}`,
      category: 'trading'
    });
    
    await updateDoc(userRef, { virtualCash: currentCash + total });
    
    const newShares = holdingData.shares - shares;
    await updateDoc(doc(db, 'holdings', holdingDoc.id), { shares: newShares });
    
    const pnl = (price - holdingData.avgPrice) * shares;
    
    await addDoc(collection(db, 'trades'), {
      userId, symbol, type: 'sell', shares, price, total, pnl, timestamp: serverTimestamp()
    });
    
    return { 
      success: true, 
      message: `Successfully sold ${shares} shares of ${symbol}`,
      trade: { id: Date.now().toString(), userId, symbol, type: 'sell', shares, price, total, timestamp: new Date(), pnl }
    };
  },

  async getTradeHistory(userId: string) {
    const tradesQuery = query(collection(db, 'trades'), where('userId', '==', userId));
    const tradesSnapshot = await getDocs(tradesQuery);
    
    const trades = tradesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
    
    return trades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  // Fantasy League
  async createDefaultLeagues() {
    const leagues = [
      { name: 'Rookie League', entryFee: 1000, prizePool: 25000, maxParticipants: 50, difficulty: 'Easy', duration: 3 },
      { name: 'Pro League', entryFee: 5000, prizePool: 100000, maxParticipants: 100, difficulty: 'Medium', duration: 7 },
      { name: 'Elite League', entryFee: 10000, prizePool: 250000, maxParticipants: 200, difficulty: 'Hard', duration: 14 }
    ];

    for (const league of leagues) {
      const existingQuery = query(collection(db, 'fantasy_leagues'), where('name', '==', league.name));
      const existing = await getDocs(existingQuery);
      const activeLeague = existing.docs.find(doc => doc.data().status === 'waiting' || doc.data().status === 'active');
      
      if (!activeLeague) {
        await addDoc(collection(db, 'fantasy_leagues'), {
          ...league, status: 'waiting', participants: 0, createdAt: serverTimestamp()
        });
      }
    }
  },

  async getAllFantasyLeagues() {
    const leagueSnapshot = await getDocs(collection(db, 'fantasy_leagues'));
    const leagues = leagueSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data(), endDate: doc.data().endDate?.toDate ? doc.data().endDate.toDate() : doc.data().endDate }))
      .filter(league => league.status === 'waiting' || league.status === 'active');
    return leagues.sort((a, b) => a.entryFee - b.entryFee);
  },

  async submitFantasyDraft(userId: string, leagueId: string, selectedStocks: string[]) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    const currentCash = userData?.virtualCash || 0;
    
    const leagueDoc = await getDoc(doc(db, 'fantasy_leagues', leagueId));
    const leagueData = leagueDoc.data();
    
    if (!leagueData) throw new Error('League not found');
    if (leagueData.status === 'active') throw new Error('League has started, cannot modify draft');
    if (currentCash < leagueData.entryFee) throw new Error(`Insufficient funds. Need ₭${leagueData.entryFee.toLocaleString()}`);
    
    const existingDraft = query(collection(db, 'fantasy_drafts'), where('userId', '==', userId));
    const draftSnapshot = await getDocs(existingDraft);
    const userLeagueDraft = draftSnapshot.docs.find(doc => doc.data().leagueId === leagueId);
    
    if (userLeagueDraft) {
      await updateDoc(doc(db, 'fantasy_drafts', userLeagueDraft.id), {
        selectedStocks, submittedAt: serverTimestamp()
      });
    } else {
      await updateDoc(doc(db, 'users', userId), { virtualCash: currentCash - leagueData.entryFee });
      
      const baselinePrices = {};
      selectedStocks.forEach(symbol => {
        baselinePrices[symbol] = alphaVantageApi.getBaselinePrice(symbol);
      });
      
      await addDoc(collection(db, 'fantasy_drafts'), {
        userId, leagueId, userName: userData?.name || 'Anonymous', selectedStocks, baselinePrices,
        submittedAt: serverTimestamp(), currentScore: 0, entryFeePaid: leagueData.entryFee
      });
      
      const newParticipants = (leagueData.participants || 0) + 1;
      const updateData = { participants: newParticipants };
      
      if (newParticipants >= leagueData.maxParticipants) {
        updateData.status = 'active';
        updateData.startDate = serverTimestamp();
        updateData.endDate = new Date(Date.now() + leagueData.duration * 24 * 60 * 60 * 1000);
      }
      
      await updateDoc(doc(db, 'fantasy_leagues', leagueId), updateData);
    }
    
    return { success: true, leagueId };
  },

  async getUserFantasyDraft(userId: string) {
    const draftQuery = query(collection(db, 'fantasy_drafts'), where('userId', '==', userId));
    const draftSnapshot = await getDocs(draftQuery);
    
    if (draftSnapshot.empty) return null;
    
    return { id: draftSnapshot.docs[0].id, ...draftSnapshot.docs[0].data() };
  }
};