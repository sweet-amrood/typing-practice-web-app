import { DIFFICULTY_MODES } from './stages.js';

export const MIN_STARS_TO_UNLOCK = 2;

export const STAR_LABELS = {
  0: 'Try again',
  1: 'Keep practicing',
  2: 'Level passed',
  3: 'Perfect',
};

export const MODE_STAR_CRITERIA = {
  beginner: {
    3: { minWpm: 35, minAccuracy: 95 },
    2: { minWpm: 30, minAccuracy: 75 },
    1: { minWpm: 20, minAccuracy: 60 },
  },
  intermediate: {
    3: { minWpm: 45, minAccuracy: 98 },
    2: { minWpm: 35, minAccuracy: 95 },
    1: { minWpm: 25, minAccuracy: 80 },
  },
  advanced: {
    3: { minWpm: 55, minAccuracy: 99 },
    2: { minWpm: 40, minAccuracy: 95 },
    1: { minWpm: 30, minAccuracy: 85 },
  },
};

export const getModeStarCriteria = (mode) =>
  MODE_STAR_CRITERIA[mode] ?? MODE_STAR_CRITERIA.beginner;

export const calculateLessonStars = (mode, wpm, accuracy) => {
  const criteria = getModeStarCriteria(mode);
  const roundedAccuracy = Math.round(Number(accuracy));
  const roundedWpm = Math.round(Number(wpm));

  if (
    roundedWpm >= criteria[3].minWpm &&
    roundedAccuracy >= criteria[3].minAccuracy
  ) {
    return 3;
  }

  if (
    roundedWpm >= criteria[2].minWpm &&
    roundedAccuracy >= criteria[2].minAccuracy
  ) {
    return 2;
  }

  if (
    roundedWpm >= criteria[1].minWpm &&
    roundedAccuracy >= criteria[1].minAccuracy
  ) {
    return 1;
  }

  return 0;
};

export const meetsLessonStarRequirement = (mode, wpm, accuracy) =>
  calculateLessonStars(mode, wpm, accuracy) >= MIN_STARS_TO_UNLOCK;

export const normalizeLessonStars = (progress) => {
  const stored = progress?.lessonStars ?? {};

  return Object.fromEntries(
    DIFFICULTY_MODES.map((mode) => {
      const modeStars = stored[mode];

      if (!modeStars || typeof modeStars !== 'object') {
        return [mode, {}];
      }

      if (modeStars instanceof Map) {
        return [mode, Object.fromEntries(modeStars)];
      }

      const normalized = {};

      for (const [key, value] of Object.entries(modeStars)) {
        const stars = Number(value);
        if (Number.isFinite(stars) && stars > 0) {
          normalized[String(key)] = stars;
        }
      }

      return [mode, normalized];
    })
  );
};

export const getLevelStars = (lessonStars, mode, level) => {
  const modeStars = lessonStars[mode] ?? {};
  const stored = Number(modeStars[level] ?? modeStars[String(level)] ?? 0);

  if (!Number.isFinite(stored) || stored < 1) {
    return 0;
  }

  return Math.min(3, Math.max(1, Math.round(stored)));
};

export const setLevelStarRating = (progress, mode, level, stars) => {
  if (!progress.lessonStars) {
    progress.lessonStars = Object.fromEntries(
      DIFFICULTY_MODES.map((item) => [item, {}])
    );
  }

  if (!progress.lessonStars[mode] || typeof progress.lessonStars[mode] !== 'object') {
    progress.lessonStars[mode] = {};
  }

  const key = String(level);
  const earned = Math.min(3, Math.max(0, Math.round(Number(stars)) || 0));

  if (earned < 1) {
    return;
  }

  const current = Number(progress.lessonStars[mode][key] ?? 0);
  progress.lessonStars[mode][key] = Math.max(current, earned);
};

export const formatStarRequirements = (mode) => {
  const criteria = getModeStarCriteria(mode);

  return {
    mode,
    minStarsToUnlock: MIN_STARS_TO_UNLOCK,
    stars: {
      3: { label: STAR_LABELS[3], ...criteria[3] },
      2: { label: STAR_LABELS[2], ...criteria[2] },
      1: { label: STAR_LABELS[1], ...criteria[1] },
      0: { label: STAR_LABELS[0] },
    },
  };
};
