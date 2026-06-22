import { Router } from 'express';
import { getTitles, updateTitle } from '../controllers/titleController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getTitles);
router.patch('/', updateTitle);

export default router;
