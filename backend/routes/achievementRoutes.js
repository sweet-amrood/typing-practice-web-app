import { Router } from 'express';
import { getAchievements } from '../controllers/achievementController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getAchievements);

export default router;
