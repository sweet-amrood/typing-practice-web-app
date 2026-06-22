import { getUserAchievements } from '../services/achievementService.js';

export const getAchievements = async (req, res) => {
  try {
    const data = await getUserAchievements(req.user._id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
