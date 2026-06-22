import {
  equipCosmetic,
  formatCosmeticsForUser,
  formatShopCatalog,
  purchaseShopItem,
  uploadCustomAvatar,
} from '../services/cosmeticsService.js';
import { getOrCreateProgress } from '../services/progressRecordService.js';

export const getShop = async (req, res) => {
  try {
    const progress = await getOrCreateProgress(req.user._id);
    const [cosmetics, shop] = await Promise.all([
      formatCosmeticsForUser(progress, req.user._id),
      Promise.resolve(formatShopCatalog(progress)),
    ]);

    res.status(200).json({
      success: true,
      data: { cosmetics, shop, coins: progress.coins },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const buyItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, message: 'itemId is required' });
    }

    const data = await purchaseShopItem(req.user._id, itemId);

    res.status(200).json({
      success: true,
      message: 'Purchase successful',
      data,
    });
  } catch (error) {
    res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCosmetics = async (req, res) => {
  try {
    const { avatarId, frameId, iconId, soundPackId, trailId } = req.body;
    const cosmetics = await equipCosmetic(req.user._id, {
      avatarId,
      frameId,
      iconId,
      soundPackId,
      trailId,
    });

    res.status(200).json({
      success: true,
      data: cosmetics,
    });
  } catch (error) {
    res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCosmetics = async (req, res) => {
  try {
    const progress = await getOrCreateProgress(req.user._id);
    const cosmetics = await formatCosmeticsForUser(progress, req.user._id);

    res.status(200).json({
      success: true,
      data: cosmetics,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const { imageData } = req.body;

    const cosmetics = await uploadCustomAvatar(req.user._id, imageData);

    res.status(200).json({
      success: true,
      message: 'Profile photo updated',
      data: cosmetics,
    });
  } catch (error) {
    res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message,
    });
  }
};
