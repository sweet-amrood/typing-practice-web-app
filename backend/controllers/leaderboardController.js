import {
  getFriendsLeaderboard,
  getGlobalLeaderboard,
  getLeaderboardMeta,
  getPlayerPublicStats,
  getWeeklyLeaderboard,
} from '../services/leaderboardService.js';

export const getGlobal = async (req, res) => {
  try {
    const entries = await getGlobalLeaderboard(50);

    res.status(200).json({
      success: true,
      data: {
        entries,
        meta: getLeaderboardMeta(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWeekly = async (req, res) => {
  try {
    const entries = await getWeeklyLeaderboard(50);

    res.status(200).json({
      success: true,
      data: {
        entries,
        meta: getLeaderboardMeta(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFriends = async (req, res) => {
  try {
    const entries = await getFriendsLeaderboard(req.user._id, 50);

    res.status(200).json({
      success: true,
      data: {
        entries,
        meta: getLeaderboardMeta(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPlayerStats = async (req, res) => {
  try {
    const stats = await getPlayerPublicStats(req.params.userId);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'Player not found',
      });
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
