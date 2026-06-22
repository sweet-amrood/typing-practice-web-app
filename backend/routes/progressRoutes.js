import { Router } from 'express';
import {
  collectDailyReward,
  getDailyReward,
  getProgress,
  getStageProgress,
  updateStageProgress,
  updateTheme,
} from '../controllers/progressController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getProgress);
router.get('/daily-reward', getDailyReward);
router.post('/daily-reward/collect', collectDailyReward);
router.get('/stages', getStageProgress);
router.put('/stages', updateStageProgress);
router.patch('/theme', updateTheme);

export default router;
