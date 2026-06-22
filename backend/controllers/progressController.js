import Progress from '../models/Progress.js';
import {
  DIFFICULTY_MODES,
  formatProgressStats,
  formatStageProgress,
  getCurrentLevelForMode,
  LEVELS_PER_MODE,
  meetsStageRequirements,
  MODE_LABELS,
  normalizeLessonProgress,
} from '../utils/stages.js';
import {
  calculateLessonStars,
  formatStarRequirements,
  getLevelStars,
  MIN_STARS_TO_UNLOCK,
  normalizeLessonStars,
  setLevelStarRating,
} from '../utils/lessonStars.js';
import {
  collectDailyReward as collectDailyRewardService,
  unlockAchievements,
} from '../services/achievementService.js';
import { getOrCreateProgress } from '../services/progressRecordService.js';
import { syncProgressThemes, setActiveTheme } from '../services/themeService.js';
import { syncProgressTitles } from '../services/titleService.js';
import { formatMissionsForUser } from '../services/missionService.js';
import { formatCosmeticsForUser } from '../services/cosmeticsService.js';
import { getDailyRewardStatus } from '../utils/dailyReward.js';

export const getProgress = async (req, res) => {
  try {
    const [{ progress, themeData }, { titleData }] = await Promise.all([
      syncProgressThemes(req.user._id),
      syncProgressTitles(req.user._id),
    ]);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found for user',
      });
    }

    const [cosmetics, missions] = await Promise.all([
      formatCosmeticsForUser(progress, req.user._id),
      Promise.resolve(formatMissionsForUser(progress)),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...formatProgressStats(progress.toObject(), themeData, titleData),
        cosmetics,
        missions,
        avatarId: progress.avatarId,
        frameId: progress.frameId,
        iconId: progress.iconId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStageProgress = async (req, res) => {
  try {
    const progress = await getOrCreateProgress(req.user._id, { lean: true });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found for user',
      });
    }

    res.status(200).json({
      success: true,
      data: formatStageProgress(progress),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateStageProgress = async (req, res) => {
  try {
    const { wpm, accuracy, mode, level } = req.body;

    if (wpm === undefined || accuracy === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide wpm and accuracy',
      });
    }

    if (!mode || !DIFFICULTY_MODES.includes(mode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid mode: beginner, intermediate, or advanced',
      });
    }

    const targetLevel = Number(level);

    if (
      !Number.isInteger(targetLevel) ||
      targetLevel < 1 ||
      targetLevel > LEVELS_PER_MODE
    ) {
      return res.status(400).json({
        success: false,
        message: `Level must be between 1 and ${LEVELS_PER_MODE}`,
      });
    }

    const progress = await getOrCreateProgress(req.user._id, { lean: true });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found for user',
      });
    }

    const lessonProgress = normalizeLessonProgress(progress);
    const lessonStars = normalizeLessonStars(progress);
    const stars = calculateLessonStars(mode, wpm, accuracy);
    const existingStars = getLevelStars(lessonStars, mode, targetLevel);
    const isCompleted = lessonProgress[mode].includes(targetLevel);
    const currentLevel = getCurrentLevelForMode(mode, lessonProgress);

    const respondWithProgress = (progressLean, payload) =>
      res.status(200).json({
        success: true,
        ...payload,
        data: {
          ...formatStageProgress(progressLean),
          ...payload.data,
        },
      });

    if (isCompleted) {
      const progressDoc = await Progress.findOne({ userId: req.user._id });

      if (!progressDoc) {
        return res.status(404).json({
          success: false,
          message: 'Progress record not found for user',
        });
      }

      let bestStars = existingStars;
      let improved = false;

      if (stars > existingStars) {
        setLevelStarRating(progressDoc, mode, targetLevel, stars);
        progressDoc.markModified('lessonStars');
        await progressDoc.save();
        bestStars = getLevelStars(
          normalizeLessonStars(progressDoc),
          mode,
          targetLevel
        );
        improved = true;
      }

      const message = improved
        ? `Improved to ${bestStars} star${bestStars === 1 ? '' : 's'}!`
        : bestStars > 0
          ? `Best score kept: ${bestStars} star${bestStars === 1 ? '' : 's'}`
          : `Level ${targetLevel} already completed`;

      return respondWithProgress(progressDoc.toObject(), {
        message,
        data: {
          completedLevel: targetLevel,
          completedMode: mode,
          unlockedLevel:
            targetLevel < LEVELS_PER_MODE ? targetLevel + 1 : null,
          stars: bestStars,
          attemptStars: stars,
          improved,
        },
      });
    }

    if (currentLevel === null) {
      return res.status(400).json({
        success: false,
        message: `All ${MODE_LABELS[mode]} levels are already completed`,
      });
    }

    if (targetLevel !== currentLevel) {
      return res.status(400).json({
        success: false,
        message: `You can only complete level ${currentLevel} in ${mode}`,
        data: { mode, currentLevel },
      });
    }

    if (!meetsStageRequirements(mode, wpm, accuracy)) {
      return res.status(400).json({
        success: false,
        message:
          stars >= 1
            ? `Need at least ${MIN_STARS_TO_UNLOCK} stars to unlock the next level`
            : 'Level requirements not met — try again',
        data: {
          stars,
          requiredStars: MIN_STARS_TO_UNLOCK,
          starRequirements: formatStarRequirements(mode),
          achieved: { wpm, accuracy },
        },
      });
    }

    const progressDoc = await Progress.findOne({ userId: req.user._id });

    if (!progressDoc) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found for user',
      });
    }

    progressDoc.lessonProgress[mode].push(targetLevel);
    progressDoc.lessonProgress[mode].sort((a, b) => a - b);
    setLevelStarRating(progressDoc, mode, targetLevel, stars);
    progressDoc.markModified('lessonProgress');
    progressDoc.markModified('lessonStars');

    const updatedProgress = await progressDoc.save();
    const updatedLean = updatedProgress.toObject();
    const bestStars = getLevelStars(
      normalizeLessonStars(updatedLean),
      mode,
      targetLevel
    );

    await unlockAchievements(req.user._id, updatedLean);

    const nextLevel =
      targetLevel < LEVELS_PER_MODE ? targetLevel + 1 : null;

    return respondWithProgress(updatedLean, {
      message:
        nextLevel === null
          ? `${mode} mode completed`
          : `Level ${targetLevel} completed. Level ${nextLevel} unlocked.`,
      data: {
        completedLevel: targetLevel,
        completedMode: mode,
        unlockedLevel: nextLevel,
        stars: bestStars,
        attemptStars: stars,
        improved: true,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDailyReward = async (req, res) => {
  try {
    const progress = await getOrCreateProgress(req.user._id, { lean: true });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found for user',
      });
    }

    res.status(200).json({
      success: true,
      data: getDailyRewardStatus(progress),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const collectDailyReward = async (req, res) => {
  try {
    const result = await collectDailyRewardService(req.user._id);

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    if (!theme) {
      return res.status(400).json({
        success: false,
        message: 'Theme is required',
      });
    }

    const themeData = await setActiveTheme(req.user._id, theme);

    res.status(200).json({
      success: true,
      data: themeData,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};
