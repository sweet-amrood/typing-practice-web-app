import Achievement from '../models/Achievement.js';
import {
  ALL_FRAMES,
  ALL_SHOP_ITEMS,
  ALL_SOUND_PACKS,
  ALL_TYPING_TRAILS,
  AVATARS,
  CUSTOM_AVATAR_ID,
  FRAMES,
  getAvatarById,
  getDefaultOwnedAvatars,
  getDefaultOwnedSoundPacks,
  getDefaultOwnedTrails,
  getFrameById,
  getShopItemById,
  getSoundPackById,
  getTrailById,
  resolveAvatarImage,
  SHOP_BADGES,
} from '../utils/cosmetics.js';
import { getOrCreateProgress } from './progressRecordService.js';
import { syncProgressTitles } from './titleService.js';
import { syncProgressThemes } from './themeService.js';
import { computeUnlockedThemes } from '../utils/themes.js';

const MAX_CUSTOM_AVATAR_BYTES = 300_000;

const isFrameUnlocked = async (progress, frame, userId) => {
  if (progress.ownedFrames?.includes(frame.id)) return true;
  if (frame.unlockType === 'default') return true;

  if (frame.unlockType === 'level') {
    const { formatLevelStats } = await import('../utils/level.js');
    const level = formatLevelStats(progress.xp ?? 0).currentLevel;
    return level >= (frame.unlockLevel ?? 999);
  }

  if (frame.unlockType === 'achievement' && frame.unlockAchievement) {
    const achievement = await Achievement.findOne({
      userId,
      key: frame.unlockAchievement,
    });
    return Boolean(achievement);
  }

  return false;
};

export const syncUnlockedFrames = async (progress, userId) => {
  const owned = new Set(progress.ownedFrames ?? ['frame-basic']);

  for (const frame of FRAMES) {
    if (await isFrameUnlocked(progress, frame, userId)) {
      owned.add(frame.id);
    }
  }

  progress.ownedFrames = [...owned];
  return progress;
};

const buildAvatarList = (progress, ownedAvatars) => {
  const avatars = AVATARS.map((item) => ({
    ...item,
    owned: ownedAvatars.includes(item.id),
    equipped: (progress.avatarId ?? 'avatar-1') === item.id,
  }));

  if (progress.customAvatar) {
    avatars.push({
      id: CUSTOM_AVATAR_ID,
      label: 'Custom',
      image: progress.customAvatar,
      owned: true,
      equipped: progress.avatarId === CUSTOM_AVATAR_ID,
    });
  }

  return avatars;
};

const buildBadgeList = (progress) =>
  SHOP_BADGES.map((item) => ({
    ...item,
    owned: progress.ownedIcons?.includes(item.id) ?? false,
    equipped: progress.iconId === item.id,
  }));

const buildSoundPackList = (progress) => {
  const owned = progress.ownedSoundPacks?.length
    ? progress.ownedSoundPacks
    : getDefaultOwnedSoundPacks();

  return ALL_SOUND_PACKS.map((item) => ({
    ...item,
    owned: owned.includes(item.id),
    equipped: (progress.activeSoundPack ?? 'sound-none') === item.id,
  }));
};

const buildTrailList = (progress) => {
  const owned = progress.ownedTrails?.length
    ? progress.ownedTrails
    : getDefaultOwnedTrails();

  return ALL_TYPING_TRAILS.map((item) => ({
    ...item,
    owned: owned.includes(item.id),
    equipped: (progress.activeTrail ?? 'trail-normal') === item.id,
  }));
};

export const formatCosmeticsForUser = async (progress, userId) => {
  await syncUnlockedFrames(progress, userId);

  const ownedAvatars = progress.ownedAvatars?.length
    ? progress.ownedAvatars
    : getDefaultOwnedAvatars();

  if (progress.customAvatar && !ownedAvatars.includes(CUSTOM_AVATAR_ID)) {
    progress.ownedAvatars = [...ownedAvatars, CUSTOM_AVATAR_ID];
  }

  const badges = buildBadgeList(progress);
  const soundPacks = buildSoundPackList(progress);
  const trails = buildTrailList(progress);
  const activeTrail = getTrailById(progress.activeTrail ?? 'trail-normal');

  return {
    avatarId: progress.avatarId ?? 'avatar-1',
    customAvatar: progress.customAvatar ?? null,
    avatarImage: resolveAvatarImage(progress),
    frameId: progress.frameId ?? 'frame-basic',
    iconId: progress.iconId ?? null,
    activeSoundPack: progress.activeSoundPack ?? 'sound-none',
    activeTrail: progress.activeTrail ?? 'trail-normal',
    trailStyle: activeTrail?.style ?? 'normal',
    ownedAvatars: progress.ownedAvatars ?? ownedAvatars,
    ownedFrames: progress.ownedFrames ?? ['frame-basic'],
    ownedIcons: progress.ownedIcons ?? [],
    ownedSoundPacks: progress.ownedSoundPacks ?? getDefaultOwnedSoundPacks(),
    ownedTrails: progress.ownedTrails ?? getDefaultOwnedTrails(),
    avatars: buildAvatarList(progress, progress.ownedAvatars ?? ownedAvatars),
    frames: ALL_FRAMES.map((item) => ({
      ...item,
      owned: progress.ownedFrames?.includes(item.id) ?? item.id === 'frame-basic',
      equipped: (progress.frameId ?? 'frame-basic') === item.id,
      shopOnly: Boolean(item.price && item.price > 0),
    })),
    badges,
    icons: badges,
    soundPacks,
    trails,
  };
};

export const equipCosmetic = async (userId, { avatarId, frameId, iconId, soundPackId, trailId }) => {
  const progress = await getOrCreateProgress(userId);
  await syncUnlockedFrames(progress, userId);

  if (avatarId) {
    if (avatarId === CUSTOM_AVATAR_ID) {
      if (!progress.customAvatar) {
        const error = new Error('No custom photo uploaded');
        error.statusCode = 400;
        throw error;
      }
    } else if (!progress.ownedAvatars?.includes(avatarId)) {
      const error = new Error('Avatar not owned');
      error.statusCode = 403;
      throw error;
    } else if (!getAvatarById(avatarId)) {
      const error = new Error('Invalid avatar');
      error.statusCode = 400;
      throw error;
    }
    progress.avatarId = avatarId;
  }

  if (frameId) {
    if (!progress.ownedFrames?.includes(frameId)) {
      const error = new Error('Frame not owned');
      error.statusCode = 403;
      throw error;
    }
    if (!getFrameById(frameId)) {
      const error = new Error('Invalid frame');
      error.statusCode = 400;
      throw error;
    }
    progress.frameId = frameId;
  }

  if (iconId !== undefined) {
    if (iconId && !progress.ownedIcons?.includes(iconId)) {
      const error = new Error('Badge not owned');
      error.statusCode = 403;
      throw error;
    }
    progress.iconId = iconId || null;
  }

  if (soundPackId) {
    if (!progress.ownedSoundPacks?.includes(soundPackId)) {
      const error = new Error('Sound pack not owned');
      error.statusCode = 403;
      throw error;
    }
    if (!getSoundPackById(soundPackId)) {
      const error = new Error('Invalid sound pack');
      error.statusCode = 400;
      throw error;
    }
    progress.activeSoundPack = soundPackId;
  }

  if (trailId) {
    if (!progress.ownedTrails?.includes(trailId)) {
      const error = new Error('Typing trail not owned');
      error.statusCode = 403;
      throw error;
    }
    if (!getTrailById(trailId)) {
      const error = new Error('Invalid typing trail');
      error.statusCode = 400;
      throw error;
    }
    progress.activeTrail = trailId;
  }

  await progress.save();
  return formatCosmeticsForUser(progress, userId);
};

export const uploadCustomAvatar = async (userId, imageData) => {
  if (!imageData || typeof imageData !== 'string') {
    const error = new Error('imageData is required');
    error.statusCode = 400;
    throw error;
  }

  if (!/^data:image\/(jpeg|jpg|png|webp|gif);base64,/.test(imageData)) {
    const error = new Error('Invalid image format. Use JPEG, PNG, WebP, or GIF.');
    error.statusCode = 400;
    throw error;
  }

  const base64Part = imageData.split(',')[1] ?? '';
  const byteLength = Math.ceil((base64Part.length * 3) / 4);

  if (byteLength > MAX_CUSTOM_AVATAR_BYTES) {
    const error = new Error('Image is too large. Maximum size is 300KB.');
    error.statusCode = 400;
    throw error;
  }

  const progress = await getOrCreateProgress(userId);
  progress.customAvatar = imageData;
  progress.ownedAvatars = [
    ...new Set([...(progress.ownedAvatars ?? getDefaultOwnedAvatars()), CUSTOM_AVATAR_ID]),
  ];
  progress.avatarId = CUSTOM_AVATAR_ID;

  await progress.save();
  return formatCosmeticsForUser(progress, userId);
};

export const getPublicCosmetics = (progress) => {
  const frame = getFrameById(progress?.frameId ?? 'frame-basic') ?? FRAMES[0];
  const badge = SHOP_BADGES.find((item) => item.id === progress?.iconId) ?? null;
  const avatar = getAvatarById(progress?.avatarId ?? 'avatar-1');

  return {
    avatarId: progress?.avatarId ?? 'avatar-1',
    avatarImage: resolveAvatarImage(progress),
    avatarLabel: avatar?.label ?? 'Profile',
    frameId: frame.id,
    frameLabel: frame.label,
    frameStyle: frame.style ?? 'slate',
    frameColor: frame.color,
    badgeId: badge?.id ?? null,
    badgeEmoji: badge?.emoji ?? null,
    iconId: badge?.id ?? null,
    iconEmoji: badge?.emoji ?? null,
  };
};

export const formatShopCatalog = (progress) => {
  const unlockedThemes = computeUnlockedThemes(progress);

  return ALL_SHOP_ITEMS.map((item) => {
    let owned = false;

    if (item.category === 'frame') {
      owned = progress.ownedFrames?.includes(item.id) ?? false;
    }
    if (item.category === 'title') {
      owned = progress.purchasedShopTitles?.includes(item.id) ?? false;
    }
    if (item.category === 'badge') {
      owned = progress.ownedIcons?.includes(item.id) ?? false;
    }
    if (item.category === 'theme') {
      owned =
        unlockedThemes.includes(item.themeId) ||
        (progress.purchasedShopThemes?.includes(item.id) ?? false);
    }
    if (item.category === 'sound') {
      owned = progress.ownedSoundPacks?.includes(item.id) ?? false;
    }
    if (item.category === 'trail') {
      owned = progress.ownedTrails?.includes(item.id) ?? false;
    }

    return { ...item, owned };
  });
};

export const purchaseShopItem = async (userId, itemId) => {
  const item = getShopItemById(itemId);

  if (!item) {
    const error = new Error('Shop item not found');
    error.statusCode = 404;
    throw error;
  }

  const progress = await getOrCreateProgress(userId);

  if (item.category === 'frame' && progress.ownedFrames?.includes(item.id)) {
    const error = new Error('You already own this frame');
    error.statusCode = 409;
    throw error;
  }
  if (item.category === 'title' && progress.purchasedShopTitles?.includes(item.id)) {
    const error = new Error('You already own this title');
    error.statusCode = 409;
    throw error;
  }
  if (item.category === 'badge' && progress.ownedIcons?.includes(item.id)) {
    const error = new Error('You already own this badge');
    error.statusCode = 409;
    throw error;
  }
  if (item.category === 'theme') {
    const unlockedThemes = computeUnlockedThemes(progress);
    if (
      unlockedThemes.includes(item.themeId) ||
      progress.purchasedShopThemes?.includes(item.id)
    ) {
      const error = new Error('You already own this theme');
      error.statusCode = 409;
      throw error;
    }
  }
  if (item.category === 'sound' && progress.ownedSoundPacks?.includes(item.id)) {
    const error = new Error('You already own this sound pack');
    error.statusCode = 409;
    throw error;
  }
  if (item.category === 'trail' && progress.ownedTrails?.includes(item.id)) {
    const error = new Error('You already own this typing trail');
    error.statusCode = 409;
    throw error;
  }

  if ((progress.coins ?? 0) < item.price) {
    const error = new Error(`Not enough coins. Need ${item.price}, have ${progress.coins ?? 0}.`);
    error.statusCode = 400;
    throw error;
  }

  progress.coins -= item.price;

  if (item.category === 'frame') {
    progress.ownedFrames = [...new Set([...(progress.ownedFrames ?? []), item.id])];
    progress.frameId = item.id;
  }

  if (item.category === 'title') {
    progress.purchasedShopTitles = [
      ...new Set([...(progress.purchasedShopTitles ?? []), item.id]),
    ];
    progress.activeTitle = item.id;
  }

  if (item.category === 'badge') {
    progress.ownedIcons = [...new Set([...(progress.ownedIcons ?? []), item.id])];
    progress.iconId = item.id;
  }

  if (item.category === 'theme') {
    progress.purchasedShopThemes = [
      ...new Set([...(progress.purchasedShopThemes ?? []), item.id]),
    ];
    progress.grantedThemes = [
      ...new Set([...(progress.grantedThemes ?? []), item.themeId]),
    ];
    progress.activeTheme = item.themeId;
  }

  if (item.category === 'sound') {
    progress.ownedSoundPacks = [...new Set([...(progress.ownedSoundPacks ?? []), item.id])];
    progress.activeSoundPack = item.id;
  }

  if (item.category === 'trail') {
    progress.ownedTrails = [...new Set([...(progress.ownedTrails ?? []), item.id])];
    progress.activeTrail = item.id;
  }

  await progress.save();
  await syncProgressTitles(userId);

  if (item.category === 'theme') {
    await syncProgressThemes(userId);
  }

  return {
    item,
    coins: progress.coins,
    cosmetics: await formatCosmeticsForUser(progress, userId),
    shop: formatShopCatalog(progress),
  };
};
