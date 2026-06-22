import express, { Router } from 'express';
import {
  buyItem,
  getCosmetics,
  getShop,
  updateCosmetics,
  uploadAvatar,
} from '../controllers/shopController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getShop);
router.get('/cosmetics', getCosmetics);
router.post('/buy', buyItem);
router.post('/avatar', express.json({ limit: '500kb' }), uploadAvatar);
router.patch('/cosmetics', updateCosmetics);

export default router;
