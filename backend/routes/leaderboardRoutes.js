import express from 'express';
import {
  getFriends,
  getGlobal,
  getPlayerStats,
  getWeekly,
} from '../controllers/leaderboardController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/global', getGlobal);
router.get('/weekly', getWeekly);
router.get('/player/:userId', getPlayerStats);
router.get('/friends', protect, getFriends);

export default router;
