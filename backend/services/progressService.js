import Progress from '../models/Progress.js';
import TestResult from '../models/TestResult.js';
import {
  buildProgressUpdatePipeline,
  calculatePerformanceTier,
  calculateTierRewards,
  calculateWordsTyped,
  meetsLessonRequirements,
} from '../utils/progressRewards.js';
import { checkAndUnlockAchievements } from './achievementService.js';
import { mergeCoachAnalytics } from './coachService.js';
import {
  applyLevelUpRewards,
  detectLevelUp,
  recordMissionProgress,
} from './missionService.js';
import { getOrCreateProgress } from './progressRecordService.js';
import { syncProgressThemes } from './themeService.js';
import { syncProgressTitles } from './titleService.js';

export const submitTestResult = async (userId, testData) => {
  const {
    wpm,
    accuracy,
    duration,
    charactersTyped,
    mistakes,
    date,
    passed,
    analytics,
    mode,
    language,
  } = testData;

  const existingProgress = await getOrCreateProgress(userId, { lean: true });
  const previousXp = existingProgress.xp ?? 0;
  const wordsTyped = calculateWordsTyped(charactersTyped);

  const tier = calculatePerformanceTier({
    wpm,
    accuracy,
    mistakes,
    highestWPM: existingProgress.highestWPM,
    passed:
      passed ??
      meetsLessonRequirements(wpm, accuracy),
  });

  const rewards = calculateTierRewards(tier, { wpm, accuracy });
  const { xpEarned, coinsEarned, xpBreakdown, label: tierLabel } = rewards;

  const result = await TestResult.create({
    userId,
    wpm,
    accuracy,
    duration,
    charactersTyped,
    mistakes,
    xpEarned,
    coinsEarned,
    rewardTier: tier,
    mode: mode ?? 'practice',
    language: language ?? null,
    ...(date && { date }),
  });

  const progressDoc = await Progress.findOne({ userId });

  if (progressDoc) {
    mergeCoachAnalytics(progressDoc, {
      ...analytics,
      mode: mode ?? analytics?.mode,
    });
    await progressDoc.save();
  }

  const progress = await Progress.findOneAndUpdate(
    { userId },
    buildProgressUpdatePipeline(
      wpm,
      accuracy,
      wordsTyped,
      xpEarned,
      coinsEarned
    ),
    { new: true }
  );

  if (!progress) {
    throw new Error('Progress record could not be created for user');
  }

  let updatedProgress = progress;
  let newlyUnlocked = [];
  let newlyUnlockedTitles = [];
  let levelUp = null;

  try {
    const achievementResult = await checkAndUnlockAchievements(userId);
    updatedProgress = achievementResult.progress ?? progress;
    newlyUnlocked = achievementResult.newlyUnlocked ?? [];
    const themeResult = await syncProgressThemes(userId);
    updatedProgress = themeResult.progress ?? updatedProgress;
    const titleResult = await syncProgressTitles(userId);
    updatedProgress = titleResult.progress ?? updatedProgress;
    newlyUnlockedTitles = titleResult.newlyUnlocked ?? [];
    await recordMissionProgress(userId, { wpm, accuracy, wordsTyped });

    levelUp = detectLevelUp(previousXp, updatedProgress.xp ?? 0);
    if (levelUp) {
      updatedProgress = (await applyLevelUpRewards(userId, levelUp)) ?? updatedProgress;
    }
  } catch (error) {
    console.error('Achievement update failed:', error.message);
  }

  return {
    result,
    progress: updatedProgress,
    rewards: {
      xpEarned,
      xpBreakdown,
      coinsEarned,
      wordsTyped,
      tier,
      tierLabel,
      passed: meetsLessonRequirements(wpm, accuracy),
    },
    newlyUnlockedAchievements: newlyUnlocked,
    newlyUnlockedTitles,
    levelUp,
  };
};
