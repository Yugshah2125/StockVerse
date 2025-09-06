import { useAuth } from '@/contexts/AuthContext';

export interface FeatureRequirement {
  minLevel: number;
  message: string;
}

export const FEATURE_REQUIREMENTS: Record<string, FeatureRequirement> = {
  'trading-challenge': {
    minLevel: 3,
    message: 'Reach Level 3 to unlock Trading Challenge'
  }
};

export const useFeatureLock = (featureKey: string) => {
  const { user } = useAuth();
  const requirement = FEATURE_REQUIREMENTS[featureKey];
  
  if (!requirement) {
    return { isLocked: false, requirement: null };
  }
  
  const userLevel = user?.level || 1;
  const isLocked = userLevel < requirement.minLevel;
  
  return { isLocked, requirement };
};