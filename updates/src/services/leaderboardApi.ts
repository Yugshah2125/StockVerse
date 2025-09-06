import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from './firebase';

export interface LeaderboardUser {
  id: string;
  name: string;
  portfolioValue: number;
  createdAt: Date;
  rank: number;
}

export interface LeaderboardData {
  users: LeaderboardUser[];
  currentUserRank: number | null;
  totalUsers: number;
  hasMore: boolean;
  allUsers?: LeaderboardUser[];
}

export const leaderboardApi = {
  async getLeaderboard(pageSize: number = 50, startRank: number = 1): Promise<LeaderboardData> {
    try {
      // Get all users first
      const allUsersSnapshot = await getDocs(collection(db, 'users'));
      const allUsers: LeaderboardUser[] = [];
      
      // Calculate portfolio values for each user
      for (const doc of allUsersSnapshot.docs) {
        const userData = doc.data();
        
        // Get user's holdings to calculate total portfolio value
        const holdingsQuery = query(collection(db, 'holdings'), where('userId', '==', doc.id));
        const holdingsSnapshot = await getDocs(holdingsQuery);
        
        let holdingsValue = 0;
        holdingsSnapshot.forEach(holdingDoc => {
          const holding = holdingDoc.data();
          // Simulate current price (in real app, you'd fetch live prices)
          const currentPrice = holding.avgPrice * (1 + (Math.random() - 0.5) * 0.1);
          holdingsValue += holding.shares * currentPrice;
        });
        
        const cash = userData.virtualCash || 1000000;
        const totalPortfolioValue = cash + holdingsValue;
        
        allUsers.push({
          id: doc.id,
          name: userData.name || 'Anonymous',
          portfolioValue: totalPortfolioValue,
          createdAt: userData.createdAt?.toDate() || new Date(),
          rank: 0 // Will be set after sorting
        });
      }
      
      // Sort users by portfolio value (desc), then by creation date (asc), then by name (asc)
      allUsers.sort((a, b) => {
        if (b.portfolioValue !== a.portfolioValue) {
          return b.portfolioValue - a.portfolioValue;
        }
        if (a.createdAt.getTime() !== b.createdAt.getTime()) {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return a.name.localeCompare(b.name);
      });
      
      // Assign ranks
      allUsers.forEach((user, index) => {
        user.rank = index + 1;
      });
      
      // Get the requested page
      const startIndex = startRank - 1;
      const endIndex = Math.min(startIndex + pageSize, allUsers.length);
      const pageUsers = allUsers.slice(startIndex, endIndex);
      
      return {
        users: pageUsers,
        currentUserRank: null,
        totalUsers: allUsers.length,
        hasMore: endIndex < allUsers.length,
        allUsers // Include all users for rank calculation
      };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return this.getMockLeaderboard(pageSize);
    }
  },

  async getCurrentUserRank(userId: string, allUsers?: LeaderboardUser[]): Promise<{ rank: number; user: LeaderboardUser | null }> {
    try {
      if (allUsers) {
        const userIndex = allUsers.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          return {
            rank: allUsers[userIndex].rank,
            user: allUsers[userIndex]
          };
        }
      }
      return { rank: -1, user: null };
    } catch (error) {
      console.error('Error getting user rank:', error);
      return { rank: -1, user: null };
    }
  },

  getMockLeaderboard(pageSize: number): LeaderboardData {
    const mockUsers: LeaderboardUser[] = [
      {
        id: '1',
        name: 'TradingPro',
        portfolioValue: 1250000,
        createdAt: new Date('2024-01-01'),
        rank: 1
      },
      {
        id: '2',
        name: 'StockMaster',
        portfolioValue: 1180000,
        createdAt: new Date('2024-01-02'),
        rank: 2
      },
      {
        id: '3',
        name: 'InvestorAce',
        portfolioValue: 1120000,
        createdAt: new Date('2024-01-03'),
        rank: 3
      },
      {
        id: '4',
        name: 'MarketGuru',
        portfolioValue: 1080000,
        createdAt: new Date('2024-01-04'),
        rank: 4
      },
      {
        id: '5',
        name: 'BullRunner',
        portfolioValue: 1050000,
        createdAt: new Date('2024-01-05'),
        rank: 5
      }
    ].slice(0, pageSize);

    return {
      users: mockUsers,
      currentUserRank: 6,
      totalUsers: 1000,
      hasMore: pageSize >= 5
    };
  }
};