import Progress from '../models/Progress.js';
import TestResult from '../models/TestResult.js';
import User from '../models/User.js';
import { formatLevelStats } from '../utils/level.js';
import { DIFFICULTY_MODES, normalizeLessonProgress } from '../utils/stages.js';
import { TITLES } from '../utils/titles.js';
import { getFriendIds } from './friendService.js';
import { getPublicCosmetics } from './cosmeticsService.js';

const getTitleName = (id) =>
  TITLES.find((title) => title.id === id)?.name ?? 'Novice';

const countLessonsCompleted = (progress) => {
  const lessonProgress = normalizeLessonProgress(progress);
  return DIFFICULTY_MODES.reduce(
    (sum, mode) => sum + (lessonProgress[mode]?.length ?? 0),
    0
  );
};

const getWeekStart = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
};

const formatEntry = (rank, user, stats) => ({
  rank,
  userId: user._id?.toString() ?? user.id,
  username: user.username,
  highestWPM: stats.highestWPM ?? 0,
  averageWPM: stats.averageWPM ?? 0,
  bestAccuracy: stats.bestAccuracy ?? 0,
  averageAccuracy: Number((stats.averageAccuracy ?? 0).toFixed(1)),
  totalTestsCompleted: stats.totalTestsCompleted ?? 0,
  totalWordsTyped: stats.totalWordsTyped ?? 0,
  streak: stats.streak ?? 0,
  currentLevel: stats.currentLevel ?? 1,
  xp: stats.xp ?? 0,
  activeTitle: stats.activeTitle ?? 'novice',
  titleName: getTitleName(stats.activeTitle ?? 'novice'),
  badgeEmoji: getPublicCosmetics(stats).badgeEmoji,
  weeklyBestWPM: stats.weeklyBestWPM ?? null,
  weeklyTests: stats.weeklyTests ?? null,
});

export const getGlobalLeaderboard = async (limit = 50) => {
  const records = await Progress.find({ highestWPM: { $gt: 0 } })
    .sort({ highestWPM: -1, xp: -1 })
    .limit(limit)
    .populate('userId', 'username')
    .lean();

  return records
    .filter((record) => record.userId)
    .map((record, index) =>
      formatEntry(index + 1, record.userId, {
        highestWPM: record.highestWPM,
        averageWPM: record.averageWPM,
        bestAccuracy: record.bestAccuracy,
        totalTestsCompleted: record.totalTestsCompleted,
        totalWordsTyped: record.totalWordsTyped,
        streak: record.streak,
        currentLevel: formatLevelStats(record.xp).currentLevel,
        xp: record.xp,
        activeTitle: record.activeTitle,
      })
    );
};

export const getWeeklyLeaderboard = async (limit = 50) => {
  const weekStart = getWeekStart();

  const aggregated = await TestResult.aggregate([
    { $match: { date: { $gte: weekStart } } },
    {
      $group: {
        _id: '$userId',
        weeklyBestWPM: { $max: '$wpm' },
        weeklyTests: { $sum: 1 },
        avgAccuracy: { $avg: '$accuracy' },
      },
    },
    { $sort: { weeklyBestWPM: -1, weeklyTests: -1 } },
    { $limit: limit },
  ]);

  const userIds = aggregated.map((entry) => entry._id);
  const [users, progressRecords] = await Promise.all([
    User.find({ _id: { $in: userIds } }).select('username').lean(),
    Progress.find({ userId: { $in: userIds } })
      .select(
        'userId highestWPM averageWPM bestAccuracy totalTestsCompleted totalWordsTyped streak xp activeTitle'
      )
      .lean(),
  ]);

  const userMap = new Map(users.map((user) => [user._id.toString(), user]));
  const progressMap = new Map(
    progressRecords.map((record) => [record.userId.toString(), record])
  );

  return aggregated
    .filter((entry) => userMap.has(entry._id.toString()))
    .map((entry, index) => {
      const user = userMap.get(entry._id.toString());
      const progress = progressMap.get(entry._id.toString()) ?? {};

      return formatEntry(index + 1, user, {
        highestWPM: progress.highestWPM ?? entry.weeklyBestWPM,
        averageWPM: progress.averageWPM ?? 0,
        bestAccuracy: Math.round(entry.avgAccuracy ?? progress.bestAccuracy ?? 0),
        totalTestsCompleted: progress.totalTestsCompleted ?? 0,
        totalWordsTyped: progress.totalWordsTyped ?? 0,
        streak: progress.streak ?? 0,
        currentLevel: formatLevelStats(progress.xp ?? 0).currentLevel,
        xp: progress.xp ?? 0,
        activeTitle: progress.activeTitle,
        weeklyBestWPM: entry.weeklyBestWPM,
        weeklyTests: entry.weeklyTests,
      });
    });
};

export const getFriendsLeaderboard = async (userId, limit = 50) => {
  const friendIds = await getFriendIds(userId);
  const userIds = [userId.toString(), ...friendIds];

  const records = await Progress.find({ userId: { $in: userIds }, highestWPM: { $gt: 0 } })
    .sort({ highestWPM: -1, xp: -1 })
    .limit(limit)
    .populate('userId', 'username')
    .lean();

  return records
    .filter((record) => record.userId)
    .map((record, index) =>
      formatEntry(index + 1, record.userId, {
        highestWPM: record.highestWPM,
        averageWPM: record.averageWPM,
        bestAccuracy: record.bestAccuracy,
        totalTestsCompleted: record.totalTestsCompleted,
        totalWordsTyped: record.totalWordsTyped,
        streak: record.streak,
        currentLevel: formatLevelStats(record.xp).currentLevel,
        xp: record.xp,
        activeTitle: record.activeTitle,
      })
    );
};

export const getLeaderboardMeta = () => ({
  weekStart: getWeekStart().toISOString(),
});

export const getPlayerPublicStats = async (userId) => {
  const [progress, user, recentTests] = await Promise.all([
    Progress.findOne({ userId }).lean(),
    User.findById(userId).select('username createdAt').lean(),
    TestResult.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .select('wpm accuracy duration mistakes rewardTier date')
      .lean(),
  ]);

  if (!user) {
    return null;
  }

  const progressRecord = progress ?? {};
  const levelStats = formatLevelStats(progressRecord.xp ?? 0);
  const publicCosmetics = getPublicCosmetics(progressRecord);

  return {
    userId: user._id.toString(),
    username: user.username,
    memberSince: user.createdAt,
    activeTitle: progressRecord.activeTitle ?? 'novice',
    titleName: getTitleName(progressRecord.activeTitle ?? 'novice'),
    cosmetics: publicCosmetics,
    badgeEmoji: publicCosmetics.badgeEmoji,
    ...levelStats,
    highestWPM: progressRecord.highestWPM ?? 0,
    averageWPM: Number((progressRecord.averageWPM ?? 0).toFixed(1)),
    bestAccuracy: progressRecord.bestAccuracy ?? 0,
    averageAccuracy: Number((progressRecord.averageAccuracy ?? 0).toFixed(1)),
    totalTestsCompleted: progressRecord.totalTestsCompleted ?? 0,
    totalWordsTyped: progressRecord.totalWordsTyped ?? 0,
    streak: progressRecord.streak ?? 0,
    lessonsCompleted: countLessonsCompleted(progressRecord),
    recentTests: recentTests.map((test) => ({
      wpm: test.wpm,
      accuracy: test.accuracy,
      duration: test.duration,
      mistakes: test.mistakes,
      rewardTier: test.rewardTier,
      date: test.date,
    })),
  };
};
