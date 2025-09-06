import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/services/firebase';

export interface LeaderboardEntry {
  id: string;
  name: string;
  portfolioValue: number;
  totalReturn: number;
  returnPercent: number;
  level: number;
  rank: number;
}

const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    // Get all users
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('virtualCash', 'desc'),
      limit(50)
    );
    const usersSnapshot = await getDocs(usersQuery);
    
    const leaderboardData: LeaderboardEntry[] = [];
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Get user's holdings to calculate portfolio value
      const holdingsQuery = query(
        collection(db, 'holdings'),
        orderBy('shares', 'desc')
      );
      const holdingsSnapshot = await getDocs(holdingsQuery);
      
      let totalHoldingsValue = 0;
      let totalInvested = 0;
      
      holdingsSnapshot.docs.forEach(holdingDoc => {
        const holdingData = holdingDoc.data();
        if (holdingData.userId === userDoc.id && holdingData.shares > 0) {
          // Mock current price calculation
          const basePrices: Record<string, number> = {
            'RELIANCE': 2456.75,
            'TCS': 3542.80,
            'INFY': 1456.30,
            'HDFCBANK': 1678.45
          };
          const currentPrice = basePrices[holdingData.symbol] || 2000;
          const holdingValue = holdingData.shares * currentPrice;
          const invested = holdingData.shares * holdingData.avgPrice;
          
          totalHoldingsValue += holdingValue;
          totalInvested += invested;
        }
      });
      
      const cash = userData.virtualCash || 0;
      const portfolioValue = cash + totalHoldingsValue;
      const totalReturn = totalHoldingsValue - totalInvested;
      const returnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
      
      leaderboardData.push({
        id: userDoc.id,
        name: userData.name || 'Anonymous',
        portfolioValue: Math.round(portfolioValue),
        totalReturn: Math.round(totalReturn),
        returnPercent: Math.round(returnPercent * 100) / 100,
        level: userData.level || 1,
        rank: 0 // Will be set after sorting
      });
    }
    
    // Sort by portfolio value and assign ranks
    leaderboardData.sort((a, b) => b.portfolioValue - a.portfolioValue);
    leaderboardData.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    return leaderboardData;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};