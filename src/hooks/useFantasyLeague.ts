import { useState, useEffect } from 'react';
import { firebaseApi } from '@/services/firebaseApi';
import { useAuth } from '@/contexts/AuthContext';

export const useFantasyLeague = () => {
  const { user } = useAuth();
  const [allLeagues, setAllLeagues] = useState([]);
  const [userDrafts, setUserDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        await firebaseApi.createDefaultLeagues();
        const leagues = await firebaseApi.getAllFantasyLeagues();
        setAllLeagues(leagues);

        if (user) {
          const draft = await firebaseApi.getUserFantasyDraft(user.id);
          const drafts = {};
          if (draft) {
            drafts[draft.leagueId] = draft;
          }
          setUserDrafts(drafts);
        }
      } catch (error) {
        console.error('Error fetching fantasy league data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueData();
    
    // Update time every second for countdown
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [user]);

  const submitDraft = async (leagueId: string, selectedStocks: string[]) => {
    if (!user) throw new Error('User not authenticated');
    
    const result = await firebaseApi.submitFantasyDraft(user.id, leagueId, selectedStocks);
    
    // Refresh data
    const leagues = await firebaseApi.getAllFantasyLeagues();
    const draft = await firebaseApi.getUserFantasyDraft(user.id);
    setAllLeagues(leagues);
    if (draft) {
      setUserDrafts(prev => ({ ...prev, [leagueId]: draft }));
    }
    
    return result;
  };

  const getTimeRemaining = (league) => {
    if (!league?.endDate || league.status === 'waiting') return 'Waiting for players';
    
    const endTime = new Date(league.endDate).getTime();
    const timeLeft = endTime - currentTime;
    
    if (timeLeft <= 0) return '00:00:00';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    allLeagues,
    userDrafts,
    loading,
    submitDraft,
    getTimeRemaining
  };
};