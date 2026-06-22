import { Router } from 'express';
import {
  createResult,
  getHistory,
  getDailyActivity,
  getWeeklyActivity,
} from '../controllers/resultController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/history', getHistory);
router.get('/activity', getDailyActivity);
router.get('/activity/weekly', getWeeklyActivity);
router.post('/', createResult);

export default router;
