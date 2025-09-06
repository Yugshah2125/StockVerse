import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { calculateLevelInfo, checkLevelUp } from '@/utils/levelSystem';

export interface XPReward {
  amount: number;
  reason: string;
  category: 'trading' | 'game' | 'challenge' | 'achievement';
}

export interface XPResult {
  success: boolean;
  newXP: number;
  newLevel: number;
  levelUp?: {
    oldLevel: number;
    newLevel: number;
    unlockedFeatures: string[];
  };
  error?: string;
}

class XPService {
  private static instance: XPService;

  static getInstance(): XPService {
    if (!XPService.instance) {
      XPService.instance = new XPService();
    }
    return XPService.instance;
  }

  async awardXP(userId: string, reward: XPReward): Promise<XPResult> {
    try {
      if (!userId) {
        return { success: false, newXP: 0, newLevel: 1, error: 'User ID required' };
      }

      if (reward.amount <= 0) {
        return { success: false, newXP: 0, newLevel: 1, error: 'XP amount must be positive' };
      }

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return { success: false, newXP: 0, newLevel: 1, error: 'User not found' };
      }

      const userData = userDoc.data();
      const currentXP = userData?.xp || 0;
      const currentLevel = userData?.level || 1;
      const newXP = Math.max(0, currentXP + reward.amount); // Prevent negative XP

      // Calculate new level
      const levelInfo = calculateLevelInfo(newXP);
      const levelUpResult = checkLevelUp(currentXP, newXP);

      // Update user document
      await updateDoc(userRef, {
        xp: newXP,
        level: levelInfo.level,
        lastXPUpdate: new Date().toISOString(),
        lastXPReason: reward.reason
      });

      // Log XP transaction (optional - for analytics)
      this.logXPTransaction(userId, reward, currentXP, newXP);

      return {
        success: true,
        newXP,
        newLevel: levelInfo.level,
        levelUp: levelUpResult ? {
          oldLevel: levelUpResult.oldLevel,
          newLevel: levelUpResult.newLevel,
          unlockedFeatures: levelUpResult.unlockedFeatures
        } : undefined
      };

    } catch (error) {
      console.error('Error awarding XP:', error);
      return { 
        success: false, 
        newXP: 0, 
        newLevel: 1, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private async logXPTransaction(userId: string, reward: XPReward, oldXP: number, newXP: number) {
    try {
      // Optional: Store XP transactions for analytics
      // This could be useful for tracking user engagement
      console.log(`XP Transaction: ${userId} - ${reward.reason} (+${reward.amount} XP) - ${oldXP} → ${newXP}`);
    } catch (error) {
      // Silent fail for logging
      console.warn('Failed to log XP transaction:', error);
    }
  }

  // Predefined XP rewards for different activities
  static readonly REWARDS = {
    TRADE_BUY: { amount: 10, reason: 'Stock purchase', category: 'trading' as const },
    TRADE_SELL: { amount: 10, reason: 'Stock sale', category: 'trading' as const },
    QUIZ_COMPLETE: { amount: 15, reason: 'Quiz completed', category: 'game' as const },
    QUIZ_PERFECT: { amount: 25, reason: 'Perfect quiz score', category: 'game' as const },
    RAPID_FIRE_COMPLETE: { amount: 20, reason: 'Rapid fire challenge', category: 'challenge' as const },
    SCAM_DETECTION: { amount: 12, reason: 'Scam detected correctly', category: 'game' as const },
    DAILY_LOGIN: { amount: 5, reason: 'Daily login bonus', category: 'achievement' as const },
    FIRST_TRADE: { amount: 50, reason: 'First trade milestone', category: 'achievement' as const },
    PORTFOLIO_MILESTONE: { amount: 30, reason: 'Portfolio milestone reached', category: 'achievement' as const }
  };
}

export const xpService = XPService.getInstance();