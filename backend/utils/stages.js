import { formatLevelStats } from './level.js';
import { getDailyRewardStatus } from './dailyReward.js';
import {
  formatStarRequirements,
  getLevelStars,
  MIN_STARS_TO_UNLOCK,
  meetsLessonStarRequirement,
  normalizeLessonStars,
} from './lessonStars.js';

export const DIFFICULTY_MODES = ['beginner', 'intermediate', 'advanced'];

export const MODE_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const LEVELS_PER_MODE = 30;

export const STAGE_REQUIREMENTS = {
  minStarsToUnlock: MIN_STARS_TO_UNLOCK,
  byMode: Object.fromEntries(
    DIFFICULTY_MODES.map((mode) => [mode, formatStarRequirements(mode)])
  ),
};

export const meetsStageRequirements = (mode, wpm, accuracy) =>
  meetsLessonStarRequirement(mode, wpm, accuracy);

export const normalizeLessonProgress = (progress) => {
  const stored = progress?.lessonProgress ?? {};

  return Object.fromEntries(
    DIFFICULTY_MODES.map((mode) => [
      mode,
      Array.isArray(stored[mode])
        ? [...new Set(stored[mode])]
            .filter(
              (level) =>
                Number.isInteger(level) &&
                level >= 1 &&
                level <= LEVELS_PER_MODE
            )
            .sort((a, b) => a - b)
        : [],
    ])
  );
};

export const isLevelUnlocked = (mode, level, lessonProgress) => {
  if (level === 1) return true;

  const completed = lessonProgress[mode] ?? [];
  return completed.includes(level - 1);
};

export const getCurrentLevelForMode = (mode, lessonProgress) => {
  const completed = lessonProgress[mode] ?? [];

  for (let level = 1; level <= LEVELS_PER_MODE; level += 1) {
    if (!completed.includes(level)) {
      return level;
    }
  }

  return null;
};

const mapLevelStatus = (mode, level, lessonProgress, lessonStars) => ({
  mode,
  level,
  name: `Level ${level}`,
  completed: lessonProgress[mode].includes(level),
  unlocked: isLevelUnlocked(mode, level, lessonProgress),
  stars: getLevelStars(lessonStars, mode, level),
});

export const formatStageProgress = (progress) => {
  const lessonProgress = normalizeLessonProgress(progress);
  const lessonStars = normalizeLessonStars(progress);

  const categories = DIFFICULTY_MODES.map((mode) => ({
    mode,
    name: MODE_LABELS[mode],
    currentLevel: getCurrentLevelForMode(mode, lessonProgress),
    completedCount: lessonProgress[mode].length,
    starRequirements: formatStarRequirements(mode),
    levels: Array.from({ length: LEVELS_PER_MODE }, (_, index) =>
      mapLevelStatus(mode, index + 1, lessonProgress, lessonStars)
    ),
  }));

  const totalCompleted = DIFFICULTY_MODES.reduce(
    (sum, mode) => sum + lessonProgress[mode].length,
    0
  );

  return {
    lessonProgress,
    lessonStars,
    requirements: STAGE_REQUIREMENTS,
    levelsPerMode: LEVELS_PER_MODE,
    totalLevels: LEVELS_PER_MODE * DIFFICULTY_MODES.length,
    totalCompleted,
    categories,
  };
};

export const formatProgressStats = (progress, themeData = null, titleData = null) => {
  const lessonProgress = normalizeLessonProgress(progress);

  return {
    lessonProgress,
    coins: progress.coins,
    highestWPM: progress.highestWPM,
    averageWPM: progress.averageWPM,
    bestAccuracy: progress.bestAccuracy,
    averageAccuracy: Number((progress.averageAccuracy ?? 0).toFixed(1)),
    totalWordsTyped: progress.totalWordsTyped,
    totalTestsCompleted: progress.totalTestsCompleted,
    streak: progress.streak,
    specialThemeUnlocked:
      themeData?.unlockedThemes?.includes('purple-neon') ??
      progress.specialThemeUnlocked,
    activeTheme: themeData?.activeTheme ?? progress.activeTheme,
    unlockedThemes: themeData?.unlockedThemes ?? progress.unlockedThemes ?? ['dark'],
    themes: themeData?.themes ?? [],
    activeTitle: titleData?.activeTitle ?? progress.activeTitle ?? 'novice',
    unlockedTitles: titleData?.unlockedTitles ?? progress.unlockedTitles ?? ['novice'],
    titles: titleData?.titles ?? [],
    dailyReward: getDailyRewardStatus(progress),
    ...formatLevelStats(progress.xp),
  };
};
