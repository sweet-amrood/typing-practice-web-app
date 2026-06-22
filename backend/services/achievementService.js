import Progress from '../models/Progress.js';
import Achievement from '../models/Achievement.js';
import { syncProgressThemes } from './themeService.js';
import { getOrCreateProgress } from './progressRecordService.js';
import {
  ACHIEVEMENTS,
  checkAchievementConditions,
  getAchievementByKey,
} from '../utils/achievements.js';

import {
  getDailyRewardStatus,
  getStreakDayReward,
  getTodayDateString,
  getYesterdayDateString,
  SPECIAL_THEME_STREAK,
} from '../utils/dailyReward.js';

export const updateStreak = async (userId, session = null) => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const progress = await getOrCreateProgress(userId, { session });

  if (!progress) return { progress: null, streakUpdated: false };

  const isNewPracticeDay = progress.lastPracticeDate !== today;
  let streak = progress.streak;

  if (isNewPracticeDay) {
    if (!progress.lastPracticeDate) {
      streak = 1;
    } else if (progress.lastPracticeDate === yesterday) {
      streak = progress.streak + 1;
    } else {
      streak = 1;
    }
  }

  const themeJustUnlocked =
    streak >= SPECIAL_THEME_STREAK && !progress.specialThemeUnlocked;

  const updatedProgress = await Progress.findOneAndUpdate(
    { userId },
    {
      $set: {
        streak,
        lastPracticeDate: today,
      },
    },
    { new: true, ...(session ? { session } : {}) }
  );

  const themeResult = await syncProgressThemes(userId, {
    session,
    autoActivateNew: themeJustUnlocked,
  });

  return {
    progress: themeResult.progress ?? updatedProgress,
    streakUpdated: isNewPracticeDay,
    themeUnlocked: themeResult.newlyUnlocked.length > 0,
    newlyUnlockedThemes: themeResult.newlyUnlocked,
  };
};

export const collectDailyReward = async (userId) => {
  const progress = await getOrCreateProgress(userId);
  const today = getTodayDateString();
  const status = getDailyRewardStatus(progress);

  if (!status.canCollect) {
    return {
      success: false,
      message: status.practicedToday
        ? 'Daily reward already collected'
        : 'Complete a test today to unlock your daily reward',
      data: status,
    };
  }

  const rewardAmount = getStreakDayReward(Math.max(progress.streak || 1, 1));

  const updatedProgress = await Progress.findOneAndUpdate(
    { userId },
    {
      $inc: { coins: rewardAmount },
      $set: { lastRewardCollectedDate: today },
    },
    { new: true }
  );

  await unlockAchievements(userId, updatedProgress);

  return {
    success: true,
    message: `Collected ${rewardAmount} coins`,
    data: {
      ...getDailyRewardStatus(updatedProgress),
      coinsCollected: rewardAmount,
      totalCoins: updatedProgress.coins,
    },
  };
};

export const unlockAchievements = async (userId, progress, session = null) => {
  const eligibleKeys = checkAchievementConditions(progress);
  const newlyUnlocked = [];

  for (const key of eligibleKeys) {
    let existingQuery = Achievement.findOne({ userId, key });
    if (session) existingQuery = existingQuery.session(session);
    const existing = await existingQuery;

    if (existing) continue;

    const definition = getAchievementByKey(key);
    if (!definition) continue;

    const [achievement] = await Achievement.create(
      [
        {
          userId,
          key,
          name: definition.name,
          description: definition.description,
        },
      ],
      session ? { session } : {}
    );

    newlyUnlocked.push(achievement);
  }

  return newlyUnlocked;
};

export const checkAndUnlockAchievements = async (userId, session = null) => {
  const { progress, streakUpdated, themeUnlocked } = await updateStreak(
    userId,
    session
  );

  if (!progress) {
    throw new Error('Progress record not found for user');
  }

  const newlyUnlocked = await unlockAchievements(userId, progress, session);

  return {
    progress,
    newlyUnlocked,
    streakUpdated,
    themeUnlocked,
  };
};

export const getUserAchievements = async (userId) => {
  const progress = await getOrCreateProgress(userId, { lean: true });

  if (!progress) {
    throw new Error('Progress record could not be created for user');
  }

  await unlockAchievements(userId, progress);

  const unlocked = await Achievement.find({ userId }).lean();
  const unlockedMap = new Map(unlocked.map((item) => [item.key, item]));

  const achievements = ACHIEVEMENTS.map((definition) => {
    const record = unlockedMap.get(definition.key);

    return {
      key: definition.key,
      name: definition.name,
      description: definition.description,
      unlocked: Boolean(record),
      unlockedAt: record?.unlockedAt ?? null,
    };
  });

  return {
    unlockedCount: unlocked.length,
    totalCount: ACHIEVEMENTS.length,
    achievements,
  };
};
