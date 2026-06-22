import { DIFFICULTY_MODES, normalizeLessonProgress } from './stages.js';

export const TITLE_IDS = [
  'novice',
  'speedster',
  'sprinter',
  'lightning',
  'sharp-eye',
  'perfectionist',
  'dedicated',
  'veteran',
  'streaker',
  'scholar',
  'coder',
  'coach-graduate',
  'weekly-warrior',
  'shop-title-whale',
  'shop-title-phantom',
  'shop-title-mythic',
];

export const DEFAULT_TITLE = 'novice';

export const TITLES = [
  {
    id: 'novice',
    name: 'Novice',
    description: 'Every journey starts here',
    unlockHint: 'Always available',
    isDefault: true,
  },
  {
    id: 'speedster',
    name: 'Speedster',
    description: 'Breaking the 60 WPM barrier',
    unlockHint: 'Reach 60 WPM',
  },
  {
    id: 'sprinter',
    name: 'Sprinter',
    description: 'Fast fingers, faster mind',
    unlockHint: 'Reach 80 WPM',
  },
  {
    id: 'lightning',
    name: 'Lightning',
    description: 'Triple-digit typing speed',
    unlockHint: 'Reach 100 WPM',
  },
  {
    id: 'sharp-eye',
    name: 'Sharp Eye',
    description: 'Precision over speed',
    unlockHint: 'Reach 98% best accuracy',
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Flawless execution',
    unlockHint: 'Achieve 100% best accuracy',
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Practice makes permanent',
    unlockHint: 'Complete 50 typing tests',
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Seasoned typist',
    unlockHint: 'Complete 200 typing tests',
  },
  {
    id: 'streaker',
    name: 'Streaker',
    description: 'Two weeks of daily practice',
    unlockHint: 'Maintain a 14-day streak',
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Lesson master',
    unlockHint: 'Complete 30 lesson levels (any mode)',
  },
  {
    id: 'coder',
    name: 'Coder',
    description: 'Syntax in your muscle memory',
    unlockHint: 'Complete 10 programming mode tests',
  },
  {
    id: 'coach-graduate',
    name: 'Coach Graduate',
    description: 'Trained with the AI coach',
    unlockHint: 'Complete 5 coach exercises',
  },
  {
    id: 'weekly-warrior',
    name: 'Weekly Warrior',
    description: 'Conquered a weekly challenge',
    unlockHint: 'Complete the 50 tests weekly challenge',
  },
  {
    id: 'shop-title-whale',
    name: 'Coin Whale',
    description: 'Economy flex from the shop',
    unlockHint: 'Purchase from the shop',
  },
  {
    id: 'shop-title-phantom',
    name: 'Phantom Keys',
    description: 'Faster than sight',
    unlockHint: 'Purchase from the shop',
  },
  {
    id: 'shop-title-mythic',
    name: 'Mythic Typist',
    description: 'Ultimate shop prestige',
    unlockHint: 'Purchase from the shop',
  },
];

export const normalizeTitleId = (titleId) =>
  TITLE_IDS.includes(titleId) ? titleId : DEFAULT_TITLE;

const countLessonLevels = (progress) => {
  const lessonProgress = normalizeLessonProgress(progress);
  return DIFFICULTY_MODES.reduce(
    (sum, mode) => sum + (lessonProgress[mode]?.length ?? 0),
    0
  );
};

export const computeUnlockedTitles = (progress) => {
  const unlocked = [DEFAULT_TITLE];
  const coachStats = progress.coachStats ?? {};
  const codeTests = coachStats.codeTestsCompleted ?? 0;
  const exercises = coachStats.exercisesCompleted ?? 0;

  if (progress.highestWPM >= 60) unlocked.push('speedster');
  if (progress.highestWPM >= 80) unlocked.push('sprinter');
  if (progress.highestWPM >= 100) unlocked.push('lightning');
  if (progress.bestAccuracy >= 98) unlocked.push('sharp-eye');
  if (progress.bestAccuracy >= 100) unlocked.push('perfectionist');
  if (progress.totalTestsCompleted >= 50) unlocked.push('dedicated');
  if (progress.totalTestsCompleted >= 200) unlocked.push('veteran');
  if (progress.streak >= 14) unlocked.push('streaker');
  if (countLessonLevels(progress) >= 30) unlocked.push('scholar');
  if (codeTests >= 10) unlocked.push('coder');
  if (exercises >= 5) unlocked.push('coach-graduate');

  for (const titleId of progress.purchasedShopTitles ?? []) {
    if (TITLE_IDS.includes(titleId)) unlocked.push(titleId);
  }

  for (const titleId of progress.missionUnlockedTitles ?? []) {
    if (TITLE_IDS.includes(titleId)) unlocked.push(titleId);
  }

  return [...new Set(unlocked)];
};

export const formatTitlesForUser = (progress) => {
  const unlockedTitles = computeUnlockedTitles(progress);
  const activeTitle = normalizeTitleId(progress.activeTitle);

  return {
    activeTitle: unlockedTitles.includes(activeTitle) ? activeTitle : DEFAULT_TITLE,
    unlockedTitles,
    titles: TITLES.map((title) => ({
      ...title,
      unlocked: unlockedTitles.includes(title.id),
    })),
  };
};

export const getNewlyUnlockedTitles = (previous, next) =>
  next.filter((id) => !previous.includes(id));
