import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { leaderboardApi, LeaderboardUser, LeaderboardData } from '@/services/leaderboardApi';

export const useLeaderboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<LeaderboardData>({
    users: [],
    currentUserRank: null,
    totalUsers: 0,
    hasMore: false
  });
  const [currentUserData, setCurrentUserData] = useState<LeaderboardUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = async (reset: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const pageToLoad = reset ? 1 : currentPage + 1;
      const startRank = (pageToLoad - 1) * 50 + 1;
      const leaderboardData = await leaderboardApi.getLeaderboard(50, startRank);
      
      // Get current user rank if user is logged in
      if (user?.id && leaderboardData.allUsers) {
        const userRankData = await leaderboardApi.getCurrentUserRank(user.id, leaderboardData.allUsers);
        leaderboardData.currentUserRank = userRankData.rank > 0 ? userRankData.rank : null;
        setCurrentUserData(userRankData.user);
      }

      setData(prevData => ({
        ...leaderboardData,
        users: reset ? leaderboardData.users : [...prevData.users, ...leaderboardData.users]
      }));
      
      setCurrentPage(pageToLoad);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Leaderboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && data.hasMore) {
      loadLeaderboard(false);
    }
  };

  const refresh = () => {
    setCurrentPage(1);
    loadLeaderboard(true);
  };

  useEffect(() => {
    loadLeaderboard(true);
  }, [user?.id]);

  return {
    data,
    currentUserData,
    isLoading,
    error,
    loadMore,
    refresh
  };
};