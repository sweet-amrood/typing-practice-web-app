import User from '../models/User.js';
import { buildCoachReport } from './coachService.js';
import { getOrCreateProgress } from './progressRecordService.js';
import { generatePersonalizedText } from '../utils/personalizedText.js';

const DEFAULT_PREFERENCES = {
  interests: [],
  careerGoal: null,
  difficulty: 'intermediate',
};

export const normalizeTypingPreferences = (preferences = {}) => ({
  interests: Array.isArray(preferences.interests)
    ? preferences.interests.slice(0, 3)
    : [],
  careerGoal: preferences.careerGoal ?? null,
  difficulty: preferences.difficulty ?? 'intermediate',
});

export const getPersonalizedPracticeText = async (userId, options = {}) => {
  const user = await User.findById(userId).lean();
  const progress = await getOrCreateProgress(userId, { lean: true });
  const preferences = normalizeTypingPreferences(user?.typingPreferences);
  const coachReport = buildCoachReport(progress);
  const wordCount = Number(options.wordCount) || null;

  const payload = generatePersonalizedText({
    interests: preferences.interests,
    careerGoal: preferences.careerGoal,
    difficulty: preferences.difficulty,
    weakKeys: coachReport.weakKeys ?? [],
    wordCount,
  });

  return {
    ...payload,
    preferences,
    hasCoachData: coachReport.hasData,
  };
};

export { DEFAULT_PREFERENCES };
