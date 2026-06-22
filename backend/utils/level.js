import { getLevelProgress } from './progressRewards.js';

export { calculateLevel, getLevelProgress } from './progressRewards.js';

export const formatLevelStats = (xp) => {
  const levelProgress = getLevelProgress(xp);

  return {
    currentLevel: levelProgress.level,
    xp,
    xpInLevel: levelProgress.xpInLevel,
    xpRequiredForLevel: levelProgress.xpRequiredForLevel,
    xpToNextLevel: levelProgress.xpToNextLevel,
    nextLevelMinXp: levelProgress.nextLevelMinXp,
    levelProgressPercent: levelProgress.progressPercent,
  };
};
