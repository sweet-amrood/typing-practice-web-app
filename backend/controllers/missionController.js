import {
  claimMissionReward,
  formatMissionsForUser,
} from '../services/missionService.js';
import { getOrCreateProgress } from '../services/progressRecordService.js';

export const getMissions = async (req, res) => {
  try {
    const progress = await getOrCreateProgress(req.user._id);
    res.status(200).json({
      success: true,
      data: formatMissionsForUser(progress),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const claimMission = async (req, res) => {
  try {
    const { type, missionId } = req.body;

    if (!['daily', 'weekly'].includes(type) || !missionId) {
      return res.status(400).json({
        success: false,
        message: 'Provide type (daily|weekly) and missionId',
      });
    }

    const data = await claimMissionReward(req.user._id, type, missionId);

    res.status(200).json({
      success: true,
      message: 'Reward claimed',
      data,
    });
  } catch (error) {
    res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message,
    });
  }
};
