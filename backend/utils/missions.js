export const DAILY_MISSIONS = [
  {
    id: 'daily_tests_5',
    title: 'Complete 5 tests',
    description: 'Finish 5 typing tests today',
    metric: 'testsCompleted',
    target: 5,
    reward: { type: 'coins', amount: 50 },
  },
  {
    id: 'daily_accuracy_95',
    title: 'Reach 95% accuracy',
    description: 'Hit at least 95% accuracy on any test today',
    metric: 'bestAccuracy',
    target: 95,
    reward: { type: 'coins', amount: 30 },
  },
  {
    id: 'daily_words_1000',
    title: 'Type 1,000 words',
    description: 'Type 1,000 words across tests today',
    metric: 'wordsTyped',
    target: 1000,
    reward: { type: 'xp', amount: 40 },
  },
  {
    id: 'daily_wpm_70',
    title: 'Achieve 70 WPM',
    description: 'Reach 70 WPM on any test today',
    metric: 'bestWpm',
    target: 70,
    reward: { type: 'badge', achievementKey: 'daily_speedster', label: 'Speed Sprinter badge' },
  },
];

export const WEEKLY_CHALLENGES = [
  {
    id: 'weekly_words_20000',
    title: 'Type 20,000 words',
    description: 'Type twenty thousand words this week',
    metric: 'wordsTyped',
    target: 20000,
    reward: { type: 'coins', amount: 200 },
  },
  {
    id: 'weekly_streak_7',
    title: 'Maintain a 7-day streak',
    description: 'Keep your practice streak at 7+ days',
    metric: 'streakDays',
    target: 7,
    reward: { type: 'xp', amount: 150 },
  },
  {
    id: 'weekly_tests_50',
    title: 'Finish 50 tests',
    description: 'Complete fifty tests this week',
    metric: 'testsCompleted',
    target: 50,
    reward: { type: 'title', titleId: 'weekly-warrior', label: 'Weekly Warrior title' },
  },
  {
    id: 'weekly_bonus_theme',
    title: 'Challenge master',
    description: 'Complete all other weekly challenges',
    metric: 'allOthersComplete',
    target: 1,
    reward: { type: 'theme', themeId: 'ocean', label: 'Ocean theme unlock' },
    hiddenUntilOthers: true,
  },
];

export const getDailyMissionById = (id) => DAILY_MISSIONS.find((item) => item.id === id);
export const getWeeklyChallengeById = (id) => WEEKLY_CHALLENGES.find((item) => item.id === id);

export const getTodayKey = () => new Date().toISOString().slice(0, 10);

export const getWeekKey = () => {
  const date = new Date();
  const year = date.getFullYear();
  const start = new Date(year, 0, 1);
  const days = Math.floor((date - start) / 86400000);
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
};
