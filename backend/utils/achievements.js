import { DIFFICULTY_MODES, normalizeLessonProgress } from './stages.js';

export const ACHIEVEMENTS = [
  {
    key: 'first_test',
    name: 'First Test',
    description: 'Complete your first typing test',
    category: 'general',
  },
  {
    key: 'wpm_50',
    name: '50 WPM',
    description: 'Reach 50 words per minute',
    category: 'general',
  },
  {
    key: 'wpm_100',
    name: '100 WPM',
    description: 'Reach 100 words per minute',
    category: 'general',
  },
  {
    key: 'tests_10',
    name: '10 Tests',
    description: 'Complete 10 typing tests',
    category: 'general',
  },
  {
    key: 'tests_100',
    name: '100 Tests',
    description: 'Complete 100 typing tests',
    category: 'general',
  },
  {
    key: 'streak_7',
    name: '7-Day Streak',
    description: 'Practice 7 days in a row',
    category: 'general',
  },
  {
    key: 'perfect_accuracy',
    name: 'Perfect Accuracy',
    description: 'Achieve 100% accuracy on a test',
    category: 'general',
  },
  {
    key: 'words_10000',
    name: '10K Words',
    description: 'Type 10,000 words total',
    category: 'general',
  },
  {
    key: 'daily_speedster',
    name: 'Speed Sprinter',
    description: 'Reach 70 WPM in a daily mission',
    category: 'general',
  },
  {
    key: 'beginner_10',
    name: 'Beginner Scholar',
    description: 'Complete 10 Beginner lesson levels',
    category: 'beginner',
  },
  {
    key: 'beginner_20',
    name: 'Beginner Expert',
    description: 'Complete 20 Beginner lesson levels',
    category: 'beginner',
  },
  {
    key: 'beginner_30',
    name: 'Beginner Master',
    description: 'Complete all 30 Beginner lesson levels',
    category: 'beginner',
  },
  {
    key: 'intermediate_10',
    name: 'Intermediate Scholar',
    description: 'Complete 10 Intermediate lesson levels',
    category: 'intermediate',
  },
  {
    key: 'intermediate_20',
    name: 'Intermediate Expert',
    description: 'Complete 20 Intermediate lesson levels',
    category: 'intermediate',
  },
  {
    key: 'intermediate_30',
    name: 'Intermediate Master',
    description: 'Complete all 30 Intermediate lesson levels',
    category: 'intermediate',
  },
  {
    key: 'advanced_10',
    name: 'Advanced Scholar',
    description: 'Complete 10 Advanced lesson levels',
    category: 'advanced',
  },
  {
    key: 'advanced_20',
    name: 'Advanced Expert',
    description: 'Complete 20 Advanced lesson levels',
    category: 'advanced',
  },
  {
    key: 'advanced_30',
    name: 'Advanced Master',
    description: 'Complete all 30 Advanced lesson levels',
    category: 'advanced',
  },
];

export const getAchievementByKey = (key) =>
  ACHIEVEMENTS.find((achievement) => achievement.key === key);

const countModeLevels = (progress, mode) =>
  normalizeLessonProgress(progress)[mode]?.length ?? 0;

export const checkAchievementConditions = (progress) => {
  const unlockedKeys = [];

  if (progress.totalTestsCompleted >= 1) unlockedKeys.push('first_test');
  if (progress.highestWPM >= 50) unlockedKeys.push('wpm_50');
  if (progress.highestWPM >= 100) unlockedKeys.push('wpm_100');
  if (progress.totalTestsCompleted >= 10) unlockedKeys.push('tests_10');
  if (progress.totalTestsCompleted >= 100) unlockedKeys.push('tests_100');
  if (progress.streak >= 7) unlockedKeys.push('streak_7');
  if (progress.bestAccuracy >= 100) unlockedKeys.push('perfect_accuracy');
  if (progress.totalWordsTyped >= 10000) unlockedKeys.push('words_10000');

  for (const mode of DIFFICULTY_MODES) {
    const completed = countModeLevels(progress, mode);

    if (completed >= 10) unlockedKeys.push(`${mode}_10`);
    if (completed >= 20) unlockedKeys.push(`${mode}_20`);
    if (completed >= 30) unlockedKeys.push(`${mode}_30`);
  }

  return unlockedKeys;
};
