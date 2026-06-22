import Progress from '../models/Progress.js';
import { FINGER_LABELS, getFingerForChar, mergeCountMaps } from '../utils/keyFingerMap.js';
import { getOrCreateProgress } from './progressRecordService.js';

const PUNCT_CHARS = new Set('.,;:!?\'"()[]{}<>@#$%^&*-_=+`~|\\/');

const toRateList = (errors, attempts, limit = 8) =>
  Object.entries(attempts)
    .filter(([, count]) => count >= 5)
    .map(([key, count]) => ({
      key,
      errors: errors[key] ?? 0,
      attempts: count,
      errorRate: Math.round(((errors[key] ?? 0) / count) * 100),
    }))
    .sort((a, b) => b.errorRate - a.errorRate || b.errors - a.errors)
    .slice(0, limit);

const generateExerciseText = (weakKeys, weakFingers) => {
  const keys = weakKeys.slice(0, 4).map((item) => item.key);
  const fingers = weakFingers.slice(0, 2).map((item) => item.finger);

  if (keys.length === 0) {
    return 'the quick brown fox jumps over the lazy dog pack my box with five dozen liquor jugs';
  }

  const drills = keys.map((key) => {
    const pair = `${key}${key}${key} ${key}e ${key}r ${key}t ${key}`;
    return pair;
  });

  const fingerWords = {
    left_pinky: 'ask alas salad flask class glass',
    left_ring: 'we weep sweet street sleep deep',
    left_middle: 'edit deed feed seed speed',
    left_index: 'fire rifle rifle rifle rifle',
    right_index: 'jump judge jury jungle',
    right_middle: 'kiwi skiing bikini bikini',
    right_ring: 'loop pool cool school',
    right_pinky: 'pop crop drop sloppy',
    thumb: 'space bar space bar space bar',
  };

  const fingerDrill = fingers
    .map((finger) => fingerWords[finger])
    .filter(Boolean)
    .join(' ');

  return `${drills.join(' ')} ${fingerDrill}`.trim();
};

export const mergeCoachAnalytics = (progress, analytics = {}) => {
  if (!analytics || typeof analytics !== 'object') {
    return progress;
  }

  const coachStats = progress.coachStats ?? {
    keyErrors: {},
    keyAttempts: {},
    fingerErrors: {},
    fingerAttempts: {},
    speedDrops: 0,
    exercisesCompleted: 0,
    codeTestsCompleted: 0,
  };

  mergeCountMaps(coachStats.keyErrors, analytics.keyErrors);
  mergeCountMaps(coachStats.keyAttempts, analytics.keyAttempts);
  mergeCountMaps(coachStats.fingerErrors, analytics.fingerErrors);
  mergeCountMaps(coachStats.fingerAttempts, analytics.fingerAttempts);

  if (analytics.speedDrops) {
    coachStats.speedDrops += Number(analytics.speedDrops) || 0;
  }

  if (analytics.isCoachExercise) {
    coachStats.exercisesCompleted += 1;
  }

  const effectiveMode = analytics.mode;
  if (effectiveMode === 'code') {
    coachStats.codeTestsCompleted += 1;
  }

  progress.coachStats = coachStats;
  return progress;
};

export const buildCoachReport = (progress) => {
  const stats = progress.coachStats ?? {};
  const keyErrors = stats.keyErrors ?? {};
  const keyAttempts = stats.keyAttempts ?? {};
  const fingerErrors = stats.fingerErrors ?? {};
  const fingerAttempts = stats.fingerAttempts ?? {};

  const weakKeys = toRateList(keyErrors, keyAttempts).map((item) => ({
    ...item,
    label: item.key === ' ' ? 'space' : item.key,
    finger: getFingerForChar(item.key),
    fingerLabel: FINGER_LABELS[getFingerForChar(item.key)] ?? 'Unknown',
  }));

  const weakFingers = toRateList(fingerErrors, fingerAttempts, 8).map((item) => ({
    finger: item.key,
    label: FINGER_LABELS[item.key] ?? item.key,
    errors: item.errors,
    attempts: item.attempts,
    errorRate: item.errorRate,
  }));

  const punctAttempts = Object.entries(keyAttempts)
    .filter(([key]) => PUNCT_CHARS.has(key))
    .reduce((sum, [, count]) => sum + count, 0);
  const punctErrors = Object.entries(keyErrors)
    .filter(([key]) => PUNCT_CHARS.has(key))
    .reduce((sum, [, count]) => sum + count, 0);

  const letterAttempts = Object.entries(keyAttempts)
    .filter(([key]) => /[a-z]/i.test(key))
    .reduce((sum, [, count]) => sum + count, 0);
  const letterErrors = Object.entries(keyErrors)
    .filter(([key]) => /[a-z]/i.test(key))
    .reduce((sum, [, count]) => sum + count, 0);

  const leftFingers = ['left_pinky', 'left_ring', 'left_middle', 'left_index'];
  const rightFingers = ['right_index', 'right_middle', 'right_ring', 'right_pinky'];

  const handTotals = (fingers) => {
    const attempts = fingers.reduce(
      (sum, finger) => sum + (fingerAttempts[finger] ?? 0),
      0
    );
    const errors = fingers.reduce(
      (sum, finger) => sum + (fingerErrors[finger] ?? 0),
      0
    );

    return {
      attempts,
      errors,
      errorRate: attempts > 0 ? Math.round((errors / attempts) * 100) : 0,
    };
  };

  const accuracyPatterns = [
    {
      id: 'punctuation',
      label: 'Punctuation accuracy',
      errorRate:
        punctAttempts > 0 ? Math.round((punctErrors / punctAttempts) * 100) : null,
      attempts: punctAttempts,
    },
    {
      id: 'letters',
      label: 'Letter accuracy',
      errorRate:
        letterAttempts > 0 ? Math.round((letterErrors / letterAttempts) * 100) : null,
      attempts: letterAttempts,
    },
    {
      id: 'left_hand',
      label: 'Left hand',
      ...handTotals(leftFingers),
    },
    {
      id: 'right_hand',
      label: 'Right hand',
      ...handTotals(rightFingers),
    },
  ].filter((pattern) => pattern.attempts > 0 || pattern.errorRate !== null);

  const totalAttempts = Object.values(keyAttempts).reduce((sum, n) => sum + n, 0);
  const hasData = totalAttempts >= 20;

  const exercise = hasData
    ? {
        text: generateExerciseText(weakKeys, weakFingers),
        focusKeys: weakKeys.slice(0, 4).map((item) => item.label),
        focusFingers: weakFingers.slice(0, 2).map((item) => item.label),
      }
    : null;

  const tips = [];

  if (!hasData) {
    tips.push('Complete at least one full practice test to unlock personalized coaching.');
  } else {
    if (weakKeys[0]) {
      tips.push(
        `Focus on the "${weakKeys[0].label}" key (${weakKeys[0].fingerLabel}) — ${weakKeys[0].errorRate}% error rate.`
      );
    }
    if (weakFingers[0]) {
      tips.push(
        `Your ${weakFingers[0].label} needs work (${weakFingers[0].errorRate}% errors).`
      );
    }
    if (stats.speedDrops > 0) {
      tips.push(
        `Speed drops detected ${stats.speedDrops} time(s). Slow down slightly to maintain rhythm.`
      );
    }
    const punctPattern = accuracyPatterns.find((p) => p.id === 'punctuation');
    if (punctPattern?.errorRate > 10) {
      tips.push('Practice punctuation mode to improve symbol accuracy.');
    }
  }

  return {
    hasData,
    totalKeystrokes: totalAttempts,
    weakKeys,
    weakFingers,
    accuracyPatterns,
    speedDrops: stats.speedDrops ?? 0,
    exercisesCompleted: stats.exercisesCompleted ?? 0,
    codeTestsCompleted: stats.codeTestsCompleted ?? 0,
    exercise,
    tips,
  };
};

export const getCoachInsights = async (userId) => {
  const progress = await getOrCreateProgress(userId, { lean: true });

  if (!progress) {
    throw new Error('Progress record not found for user');
  }

  return buildCoachReport(progress);
};

export const recordCoachExerciseComplete = async (userId) => {
  const progress = await getOrCreateProgress(userId);
  const coachStats = progress.coachStats ?? {
    keyErrors: {},
    keyAttempts: {},
    fingerErrors: {},
    fingerAttempts: {},
    speedDrops: 0,
    exercisesCompleted: 0,
    codeTestsCompleted: 0,
  };

  coachStats.exercisesCompleted += 1;
  progress.coachStats = coachStats;
  await progress.save();

  return buildCoachReport(progress);
};
