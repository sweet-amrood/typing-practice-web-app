export const calculateLevel = (xp) =>
  Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;

export const getLevelProgress = (xp) => {
  const level = calculateLevel(xp);
  const currentLevelMinXp = (level - 1) ** 2 * 100;
  const nextLevelMinXp = level ** 2 * 100;
  const xpInLevel = xp - currentLevelMinXp;
  const xpRequiredForLevel = nextLevelMinXp - currentLevelMinXp;
  const xpToNextLevel = nextLevelMinXp - xp;
  const progressPercent = Math.min(
    100,
    Math.round((xpInLevel / xpRequiredForLevel) * 100)
  );

  return {
    level,
    xpInLevel,
    xpRequiredForLevel,
    xpToNextLevel,
    progressPercent,
  };
};
