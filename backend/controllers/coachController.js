import {
  getCoachInsights,
  recordCoachExerciseComplete,
} from '../services/coachService.js';
import { getPersonalizedPracticeText } from '../services/personalizedTextService.js';
import { syncProgressTitles } from '../services/titleService.js';

export const getInsights = async (req, res) => {
  try {
    const insights = await getCoachInsights(req.user._id);

    res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const completeExercise = async (req, res) => {
  try {
    const insights = await recordCoachExerciseComplete(req.user._id);
    const { newlyUnlocked } = await syncProgressTitles(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        insights,
        newlyUnlockedTitles: newlyUnlocked,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPersonalizedText = async (req, res) => {
  try {
    const wordCount = req.query.wordCount ? Number(req.query.wordCount) : null;
    const payload = await getPersonalizedPracticeText(req.user._id, { wordCount });

    res.status(200).json({
      success: true,
      data: payload,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
