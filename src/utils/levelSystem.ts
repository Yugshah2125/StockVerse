export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  xpNeededForNext: number;
  progressPercent: number;
}

export interface LevelUpResult {
  newLevel: number;
  oldLevel: number;
  xpCarriedOver: number;
  unlockedFeatures: string[];
}

export const getXPRequiredForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return (level - 1) * 1000 + Math.floor((level - 1) * 200);
};

export const calculateLevelInfo = (totalXP: number): LevelInfo => {
  let level = 1;
  
  while (getXPRequiredForLevel(level + 1) <= totalXP) {
    level++;
  }
  
  const xpForCurrentLevel = getXPRequiredForLevel(level);
  const xpForNextLevel = getXPRequiredForLevel(level + 1);
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - totalXP;
  const progressPercent = (xpInCurrentLevel / (xpForNextLevel - xpForCurrentLevel)) * 100;
  
  return {
    level,
    currentXP: totalXP,
    xpForCurrentLevel,
    xpForNextLevel,
    xpInCurrentLevel,
    xpNeededForNext,
    progressPercent
  };
};

export const checkLevelUp = (oldXP: number, newXP: number): LevelUpResult | null => {
  const oldLevelInfo = calculateLevelInfo(oldXP);
  const newLevelInfo = calculateLevelInfo(newXP);
  
  if (newLevelInfo.level > oldLevelInfo.level) {
    return {
      newLevel: newLevelInfo.level,
      oldLevel: oldLevelInfo.level,
      xpCarriedOver: newLevelInfo.xpInCurrentLevel,
      unlockedFeatures: getUnlockedFeatures(newLevelInfo.level)
    };
  }
  
  return null;
};

export const getUnlockedFeatures = (level: number): string[] => {
  const features: string[] = [];
  
  if (level >= 2) features.push("Advanced Portfolio Analytics");
  if (level >= 3) features.push("Trading Challenge", "Risk Assessment Tools");
  if (level >= 4) features.push("Premium Market Insights", "Advanced Charts");
  if (level >= 5) features.push("AI Trading Suggestions", "Portfolio Optimization");
  if (level >= 6) features.push("Options Trading", "Futures Trading");
  
  return features;
};

export const getLevelTheme = (level: number) => {
  if (level >= 6) return {
    gradient: "from-[#00246B] to-black",
    glow: "shadow-[#00246B]/20",
    accent: "text-[#00246B]",
    bg: "from-[#E1DCD0]/10 to-[#E1DCD0]/5"
  };
  if (level >= 5) return {
    gradient: "from-gold to-[#00246B]",
    glow: "shadow-gold/20",
    accent: "text-gold",
    bg: "from-gold/5 to-[#E1DCD0]/10"
  };
  if (level >= 4) return {
    gradient: "from-profit to-[#00246B]",
    glow: "shadow-profit/20",
    accent: "text-profit",
    bg: "from-profit/5 to-[#E1DCD0]/10"
  };
  if (level >= 3) return {
    gradient: "from-[#00246B] to-primary",
    glow: "shadow-primary/20",
    accent: "text-primary",
    bg: "from-primary/5 to-[#E1DCD0]/10"
  };
  return {
    gradient: "from-muted-foreground to-[#00246B]",
    glow: "shadow-muted/10",
    accent: "text-muted-foreground",
    bg: "from-muted/5 to-[#E1DCD0]/5"
  };
};