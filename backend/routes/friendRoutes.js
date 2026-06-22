import express from 'express';
import {
  createFriendRequest,
  deleteFriend,
  getFriends,
  searchFriendUsers,
  updateFriendRequest,
} from '../controllers/friendController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getFriends);
router.get('/search', searchFriendUsers);
router.post('/request', createFriendRequest);
router.patch('/request/:id', updateFriendRequest);
router.delete('/:friendId', deleteFriend);

export default router;
