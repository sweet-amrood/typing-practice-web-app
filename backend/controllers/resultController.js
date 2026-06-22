import mongoose from 'mongoose';
import TestResult from '../models/TestResult.js';
import { submitTestResult } from '../services/progressService.js';

export const createResult = async (req, res) => {
  try {
    const { wpm, accuracy, duration, charactersTyped, mistakes, date, passed, analytics, mode, language } =
      req.body;

    if (
      wpm === undefined ||
      accuracy === undefined ||
      duration === undefined ||
      charactersTyped === undefined ||
      mistakes === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide wpm, accuracy, duration, charactersTyped, and mistakes',
      });
    }

    const { result, progress, rewards, newlyUnlockedAchievements, newlyUnlockedTitles, levelUp } =
      await submitTestResult(req.user._id, {
        wpm,
        accuracy,
        duration,
        charactersTyped,
        mistakes,
        date,
        passed,
        analytics,
        mode,
        language,
      });

    res.status(201).json({
      success: true,
      message: 'Test result saved successfully',
      data: {
        result,
        progress,
        rewards,
        newlyUnlockedAchievements,
        newlyUnlockedTitles,
        levelUp,
      },
    });
  } catch (error) {
    const statusCode =
      error.message === 'Progress record not found for user' ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const results = await TestResult.find({ userId: req.user._id })
      .sort({ date: -1 })
      .select(
        'wpm accuracy duration charactersTyped mistakes xpEarned coinsEarned rewardTier date'
      )
      .lean();

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDailyActivity = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const activity = await TestResult.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          tests: { $sum: 1 },
          totalWpm: { $sum: '$wpm' },
          totalAccuracy: { $sum: '$accuracy' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          tests: 1,
          avgWpm: { $round: [{ $divide: ['$totalWpm', '$tests'] }, 1] },
          avgAccuracy: {
            $round: [{ $divide: ['$totalAccuracy', '$tests'] }, 1],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: activity.length,
      data: activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWeeklyActivity = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const activity = await TestResult.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: '$date' },
            week: { $isoWeek: '$date' },
          },
          tests: { $sum: 1 },
          totalWpm: { $sum: '$wpm' },
          totalAccuracy: { $sum: '$accuracy' },
          weekStart: { $min: '$date' },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          week: '$_id.week',
          weekStart: 1,
          tests: 1,
          avgWpm: { $round: [{ $divide: ['$totalWpm', '$tests'] }, 1] },
          avgAccuracy: {
            $round: [{ $divide: ['$totalAccuracy', '$tests'] }, 1],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: activity.length,
      data: activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
