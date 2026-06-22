export const ACHIEVEMENT_ICONS = {
  first_test: '🎯',
  wpm_50: '⚡',
  wpm_100: '🚀',
  tests_10: '📝',
  tests_100: '📚',
  streak_7: '🔥',
  perfect_accuracy: '💎',
  words_10000: '⌨️',
  daily_speedster: '🏎️',
  beginner_10: '🌱',
  beginner_20: '🌿',
  beginner_30: '🌳',
  intermediate_10: '📘',
  intermediate_20: '📗',
  intermediate_30: '📙',
  advanced_10: '🛠️',
  advanced_20: '⚙️',
  advanced_30: '🏆',
};

export const getAchievementIcon = (key) => ACHIEVEMENT_ICONS[key] ?? '★';

export const ACHIEVEMENT_CATEGORIES = {
  general: 'General',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};
