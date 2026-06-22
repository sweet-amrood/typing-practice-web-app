import { Router } from 'express';
import { claimMission, getMissions } from '../controllers/missionController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getMissions);
router.post('/claim', claimMission);

export default router;
