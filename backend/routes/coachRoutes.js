import { Router } from 'express';
import { completeExercise, getInsights, getPersonalizedText } from '../controllers/coachController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getInsights);
router.get('/personalized-text', getPersonalizedText);
router.post('/exercise-complete', completeExercise);

export default router;
