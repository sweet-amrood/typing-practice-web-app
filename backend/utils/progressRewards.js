export const LESSON_REQUIREMENTS = {
  minWpm: 30,
  minAccuracy: 95,
};

export const REWARD_TIERS = {
  failed: { xp: 5, coins: 1, label: 'Keep practicing' },
  pass: { xp: 20, coins: 5, label: 'Good job' },
  best: { xp: 35, coins: 12, label: 'New personal best' },
  perfect: { xp: 45, coins: 18, label: 'Perfect accuracy' },
  legendary: { xp: 60, coins: 25, label: 'Perfect personal best' },
};

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
    currentLevelMinXp,
    nextLevelMinXp,
    xpInLevel,
    xpRequiredForLevel,
    xpToNextLevel,
    progressPercent,
  };
};

export const meetsLessonRequirements = (wpm, accuracy) =>
  wpm >= LESSON_REQUIREMENTS.minWpm &&
  Math.round(Number(accuracy)) >= LESSON_REQUIREMENTS.minAccuracy;

export const calculatePerformanceTier = ({
  wpm,
  accuracy,
  mistakes,
  highestWPM = 0,
  passed = null,
}) => {
  const meetsPass =
    passed ?? meetsLessonRequirements(wpm, accuracy);

  if (!meetsPass) return 'failed';

  const isPerfect = accuracy === 100 && mistakes === 0;
  const isBest = wpm > highestWPM;

  if (isPerfect && isBest) return 'legendary';
  if (isPerfect) return 'perfect';
  if (isBest) return 'best';
  return 'pass';
};

export const calculateTierRewards = (tier, { wpm, accuracy }) => {
  const config = REWARD_TIERS[tier] ?? REWARD_TIERS.failed;
  const performanceBonus =
    tier === 'failed' ? 0 : Math.max(0, Math.round(wpm / 20));

  return {
    tier,
    label: config.label,
    xpEarned: config.xp,
    coinsEarned: config.coins + performanceBonus,
    xpBreakdown: {
      base: config.xp,
      performanceBonus,
      total: config.xp,
    },
  };
};

export const calculateWordsTyped = (charactersTyped) =>
  Math.floor(charactersTyped / 5);

export const buildProgressUpdatePipeline = (
  wpm,
  accuracy,
  wordsTyped,
  xpEarned,
  coinsEarned
) => [
  {
    $set: {
      highestWPM: { $max: ['$highestWPM', wpm] },
      bestAccuracy: { $max: ['$bestAccuracy', accuracy] },
      averageAccuracy: {
        $cond: {
          if: { $eq: ['$totalTestsCompleted', 0] },
          then: accuracy,
          else: {
            $round: [
              {
                $divide: [
                  {
                    $add: [
                      { $multiply: ['$averageAccuracy', '$totalTestsCompleted'] },
                      accuracy,
                    ],
                  },
                  { $add: ['$totalTestsCompleted', 1] },
                ],
              },
              1,
            ],
          },
        },
      },
      totalWordsTyped: { $add: ['$totalWordsTyped', wordsTyped] },
      averageWPM: {
        $cond: {
          if: { $eq: ['$totalTestsCompleted', 0] },
          then: wpm,
          else: {
            $round: [
              {
                $divide: [
                  {
                    $add: [
                      { $multiply: ['$averageWPM', '$totalTestsCompleted'] },
                      wpm,
                    ],
                  },
                  { $add: ['$totalTestsCompleted', 1] },
                ],
              },
              2,
            ],
          },
        },
      },
      totalTestsCompleted: { $add: ['$totalTestsCompleted', 1] },
      xp: { $add: ['$xp', xpEarned] },
      coins: { $add: ['$coins', coinsEarned] },
    },
  },
  {
    $set: {
      currentLevel: {
        $add: [{ $floor: { $sqrt: { $divide: ['$xp', 100] } } }, 1],
      },
    },
  },
];
