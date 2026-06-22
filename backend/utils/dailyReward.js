import { computeUnlockedThemes } from './themes.js';

export const SPECIAL_THEME_STREAK = 30;

const getTodayDate = () => new Date().toISOString().slice(0, 10);

export const STREAK_MILESTONES = [
  { day: 1, coins: 10, bonus: null, label: '+10 coins' },
  { day: 2, coins: 15, bonus: null, label: '+15 coins' },
  { day: 3, coins: 20, bonus: null, label: '+20 coins' },
  { day: 4, coins: 25, bonus: null, label: '+25 coins' },
  { day: 5, coins: 30, bonus: null, label: '+30 coins' },
  { day: 6, coins: 40, bonus: null, label: '+40 coins' },
  {
    day: 7,
    coins: 50,
    bonus: '7-Day Badge',
    label: '+50 coins + badge',
  },
];

export const getStreakDayReward = (streak) => {
  const day = Math.max(1, Math.min(streak || 1, 7));
  const milestone = STREAK_MILESTONES.find((item) => item.day === day);
  return milestone?.coins ?? STREAK_MILESTONES[STREAK_MILESTONES.length - 1].coins;
};

export const getSevenDayStreakCalendar = (progress) => {
  const streak = progress.streak ?? 0;
  const today = getTodayDate();
  const practicedToday = progress.lastPracticeDate === today;
  const collectedToday = progress.lastRewardCollectedDate === today;
  const canCollect = practicedToday && !collectedToday;
  const nextDay = Math.min(streak + 1, 7);

  return STREAK_MILESTONES.map((milestone) => {
    const { day } = milestone;
    let status = 'locked';

    if (streak >= day) {
      status = 'completed';
    } else if (day === nextDay) {
      status = canCollect ? 'ready' : 'current';
    }

    return {
      ...milestone,
      status,
    };
  });
};

export const getDailyRewardStatus = (progress) => {
  const today = getTodayDate();
  const practicedToday = progress.lastPracticeDate === today;
  const collectedToday = progress.lastRewardCollectedDate === today;
  const streak = progress.streak ?? 0;
  const rewardAmount = practicedToday && !collectedToday
    ? getStreakDayReward(Math.max(streak, 1))
    : getStreakDayReward(streak);

  return {
    streak,
    practicedToday,
    canCollect: practicedToday && !collectedToday,
    rewardAmount,
    sevenDayBadgeEarned: progress.streak >= 7,
    sevenDayProgress: Math.min(progress.streak, 7),
    specialThemeUnlocked: progress.specialThemeUnlocked,
    lastPracticeDate: progress.lastPracticeDate,
    lastRewardCollectedDate: progress.lastRewardCollectedDate,
    sevenDayCalendar: getSevenDayStreakCalendar(progress),
    themeMilestone: {
      day: SPECIAL_THEME_STREAK,
      label: 'Purple Neon theme',
      unlocked: computeUnlockedThemes(progress).includes('purple-neon'),
    },
  };
};

export const getTodayDateString = getTodayDate;

export const getYesterdayDateString = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
};
