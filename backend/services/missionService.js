import Achievement from '../models/Achievement.js';
import Progress from '../models/Progress.js';
import { formatLevelStats } from '../utils/level.js';
import {
  DAILY_MISSIONS,
  getDailyMissionById,
  getTodayKey,
  getWeekKey,
  getWeeklyChallengeById,
  WEEKLY_CHALLENGES,
} from '../utils/missions.js';
import { syncProgressThemes } from './themeService.js';
import { syncProgressTitles } from './titleService.js';
import { getOrCreateProgress } from './progressRecordService.js';

const ensureMissionWindows = (progress) => {
  const today = getTodayKey();
  const week = getWeekKey();

  if (!progress.missions) {
    progress.missions = {};
  }

  if (progress.missions.dailyKey !== today) {
    progress.missions.dailyKey = today;
    progress.missions.dailyTestsCompleted = 0;
    progress.missions.dailyWordsTyped = 0;
    progress.missions.dailyBestAccuracy = 0;
    progress.missions.dailyBestWpm = 0;
    progress.missions.dailyClaimed = [];
  }

  if (progress.missions.weeklyKey !== week) {
    progress.missions.weeklyKey = week;
    progress.missions.weeklyWordsTyped = 0;
    progress.missions.weeklyTestsCompleted = 0;
    progress.missions.weeklyClaimed = [];
  }
};

const getDailyProgressValue = (progress, metric) => {
  switch (metric) {
    case 'testsCompleted':
      return progress.missions.dailyTestsCompleted ?? 0;
    case 'wordsTyped':
      return progress.missions.dailyWordsTyped ?? 0;
    case 'bestAccuracy':
      return progress.missions.dailyBestAccuracy ?? 0;
    case 'bestWpm':
      return progress.missions.dailyBestWpm ?? 0;
    default:
      return 0;
  }
};

const getWeeklyProgressValue = (progress, metric) => {
  switch (metric) {
    case 'wordsTyped':
      return progress.missions.weeklyWordsTyped ?? 0;
    case 'testsCompleted':
      return progress.missions.weeklyTestsCompleted ?? 0;
    case 'streakDays':
      return progress.streak ?? 0;
    case 'allOthersComplete':
      return WEEKLY_CHALLENGES.filter((item) => !item.hiddenUntilOthers).every(
        (challenge) => progress.missions.weeklyClaimed?.includes(challenge.id)
      )
        ? 1
        : 0;
    default:
      return 0;
  }
};

const isMissionComplete = (mission, progress, type) => {
  const value =
    type === 'daily'
      ? getDailyProgressValue(progress, mission.metric)
      : getWeeklyProgressValue(progress, mission.metric);

  if (mission.metric === 'bestAccuracy' || mission.metric === 'bestWpm') {
    return value >= mission.target;
  }

  return value >= mission.target;
};

export const formatMissionsForUser = (progress) => {
  ensureMissionWindows(progress);

  const daily = DAILY_MISSIONS.map((mission) => {
    const progressValue = getDailyProgressValue(progress, mission.metric);
    const complete = isMissionComplete(mission, progress, 'daily');
    const claimed = progress.missions.dailyClaimed?.includes(mission.id) ?? false;

    return {
      ...mission,
      progress: progressValue,
      complete,
      claimed,
      readyToClaim: complete && !claimed,
    };
  });

  const weekly = WEEKLY_CHALLENGES.map((mission) => {
    const progressValue = getWeeklyProgressValue(progress, mission.metric);
    const complete = isMissionComplete(mission, progress, 'weekly');
    const claimed = progress.missions.weeklyClaimed?.includes(mission.id) ?? false;
    const visible =
      !mission.hiddenUntilOthers ||
      WEEKLY_CHALLENGES.filter((item) => !item.hiddenUntilOthers).every(
        (item) =>
          progress.missions.weeklyClaimed?.includes(item.id) ||
          isMissionComplete(item, progress, 'weekly')
      );

    return {
      ...mission,
      progress: progressValue,
      complete,
      claimed,
      readyToClaim: complete && !claimed,
      visible,
    };
  }).filter((mission) => mission.visible);

  return {
    dailyKey: progress.missions.dailyKey,
    weeklyKey: progress.missions.weeklyKey,
    daily,
    weekly,
  };
};

export const recordMissionProgress = async (userId, { wpm, accuracy, wordsTyped }) => {
  const progress = await getOrCreateProgress(userId);
  ensureMissionWindows(progress);

  progress.missions.dailyTestsCompleted += 1;
  progress.missions.dailyWordsTyped += wordsTyped ?? 0;
  progress.missions.weeklyTestsCompleted += 1;
  progress.missions.weeklyWordsTyped += wordsTyped ?? 0;
  progress.missions.dailyBestAccuracy = Math.max(
    progress.missions.dailyBestAccuracy ?? 0,
    accuracy ?? 0
  );
  progress.missions.dailyBestWpm = Math.max(progress.missions.dailyBestWpm ?? 0, wpm ?? 0);

  await progress.save();
  return formatMissionsForUser(progress);
};

const applyMissionReward = async (userId, progress, reward) => {
  const granted = { ...reward };

  if (reward.type === 'coins') {
    progress.coins += reward.amount;
  }

  if (reward.type === 'xp') {
    progress.xp += reward.amount;
    progress.currentLevel = formatLevelStats(progress.xp).currentLevel;
  }

  if (reward.type === 'badge' && reward.achievementKey) {
    const exists = await Achievement.findOne({ userId, key: reward.achievementKey });
    if (!exists) {
      await Achievement.create({
        userId,
        key: reward.achievementKey,
        name: reward.label ?? reward.achievementKey,
        description: 'Earned from a daily mission',
      });
      granted.achievementUnlocked = reward.achievementKey;
    }
  }

  if (reward.type === 'title' && reward.titleId) {
    if (!progress.missionUnlockedTitles.includes(reward.titleId)) {
      progress.missionUnlockedTitles.push(reward.titleId);
      granted.titleUnlocked = reward.titleId;
    }
  }

  if (reward.type === 'theme' && reward.themeId) {
    if (!progress.grantedThemes?.includes(reward.themeId)) {
      progress.grantedThemes = [...(progress.grantedThemes ?? []), reward.themeId];
      granted.themeUnlocked = reward.themeId;
    }
  }

  await progress.save();
  await syncProgressTitles(userId);
  await syncProgressThemes(userId);

  return granted;
};

export const claimMissionReward = async (userId, type, missionId) => {
  const progress = await getOrCreateProgress(userId);
  ensureMissionWindows(progress);

  const mission =
    type === 'daily' ? getDailyMissionById(missionId) : getWeeklyChallengeById(missionId);

  if (!mission) {
    const error = new Error('Mission not found');
    error.statusCode = 404;
    throw error;
  }

  const claimedList =
    type === 'daily' ? progress.missions.dailyClaimed : progress.missions.weeklyClaimed;

  if (claimedList.includes(missionId)) {
    const error = new Error('Reward already claimed');
    error.statusCode = 409;
    throw error;
  }

  if (!isMissionComplete(mission, progress, type)) {
    const error = new Error('Mission requirements not met yet');
    error.statusCode = 400;
    throw error;
  }

  claimedList.push(missionId);
  const reward = await applyMissionReward(userId, progress, mission.reward);

  return {
    missions: formatMissionsForUser(progress),
    reward,
    progress,
  };
};

export const detectLevelUp = (previousXp, nextXp) => {
  const previousLevel = formatLevelStats(previousXp).currentLevel;
  const nextLevel = formatLevelStats(nextXp).currentLevel;

  if (nextLevel <= previousLevel) {
    return null;
  }

  const bonusCoins = 25 + (nextLevel - previousLevel) * 15;
  const bonusXp = 10 * (nextLevel - previousLevel);
  const loot = [
    { type: 'coins', amount: bonusCoins, label: `${bonusCoins} coins` },
    { type: 'xp', amount: bonusXp, label: `${bonusXp} bonus XP` },
  ];

  if (nextLevel % 5 === 0) {
    loot.push({ type: 'loot', label: 'Mystery streak boost', bonus: '+1 day streak shield' });
  }

  return {
    previousLevel,
    newLevel: nextLevel,
    loot,
  };
};

export const applyLevelUpRewards = async (userId, levelUpEvent) => {
  if (!levelUpEvent) return null;

  const progress = await getOrCreateProgress(userId);
  const coinReward = levelUpEvent.loot.find((item) => item.type === 'coins');
  const xpReward = levelUpEvent.loot.find((item) => item.type === 'xp');

  if (coinReward) progress.coins += coinReward.amount;
  if (xpReward) progress.xp += xpReward.amount;

  progress.currentLevel = levelUpEvent.newLevel;
  progress.lastKnownLevel = levelUpEvent.newLevel;
  await progress.save();

  return progress;
};
