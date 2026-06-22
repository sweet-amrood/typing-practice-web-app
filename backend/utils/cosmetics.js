export const DEFAULT_AVATAR = 'avatar-1';
export const CUSTOM_AVATAR_ID = 'custom';
export const DEFAULT_FRAME = 'frame-basic';

export const AVATARS = [
  { id: 'avatar-1', label: 'Indigo', image: '/avatars/avatar-1.svg', defaultOwned: true },
  { id: 'avatar-2', label: 'Sky', image: '/avatars/avatar-2.svg', defaultOwned: true },
  { id: 'avatar-3', label: 'Violet', image: '/avatars/avatar-3.svg', defaultOwned: true },
  { id: 'avatar-4', label: 'Teal', image: '/avatars/avatar-4.svg', defaultOwned: true },
  { id: 'avatar-5', label: 'Amber', image: '/avatars/avatar-5.svg', defaultOwned: true },
];

export const FRAMES = [
  {
    id: 'frame-basic',
    label: 'Slate',
    style: 'slate',
    color: '#64748b',
    price: 0,
    unlockType: 'default',
    unlockHint: 'Default frame',
  },
  {
    id: 'frame-bronze',
    label: 'Bronze Crest',
    style: 'bronze',
    color: '#cd7f32',
    price: 0,
    unlockType: 'level',
    unlockLevel: 5,
    unlockHint: 'Reach player level 5',
  },
  {
    id: 'frame-emerald',
    label: 'Emerald Guard',
    style: 'emerald',
    color: '#10b981',
    price: 0,
    unlockType: 'achievement',
    unlockAchievement: 'streak_7',
    unlockHint: 'Unlock 7-Day Streak achievement',
  },
  {
    id: 'frame-neon',
    label: 'Neon Pulse',
    style: 'neon',
    color: '#a855f7',
    price: 0,
    unlockType: 'level',
    unlockLevel: 15,
    unlockHint: 'Reach player level 15',
  },
  {
    id: 'frame-legend',
    label: 'Golden Legend',
    style: 'legend',
    color: '#f59e0b',
    price: 0,
    unlockType: 'achievement',
    unlockAchievement: 'wpm_100',
    unlockHint: 'Unlock 100 WPM achievement',
  },
];

export const SHOP_FRAMES = [
  {
    id: 'frame-shop-cyber',
    label: 'Cyber Crown',
    style: 'cyber',
    color: '#ff2a6d',
    price: 500,
    category: 'frame',
    rarity: 'epic',
    description: 'Angular neon crown frame with cyberpunk energy.',
  },
  {
    id: 'frame-shop-royal',
    label: 'Royal Halo',
    style: 'royal',
    color: '#6366f1',
    price: 750,
    category: 'frame',
    rarity: 'legendary',
    description: 'Ornate halo frame for elite collectors.',
  },
  {
    id: 'frame-shop-frost',
    label: 'Frost Crystal',
    style: 'frost',
    color: '#38bdf8',
    price: 550,
    category: 'frame',
    rarity: 'epic',
    description: 'Icy crystal corners with winter shimmer.',
  },
  {
    id: 'frame-shop-inferno',
    label: 'Inferno Edge',
    style: 'inferno',
    color: '#ef4444',
    price: 650,
    category: 'frame',
    rarity: 'epic',
    description: 'Burning edges for fearless typists.',
  },
  {
    id: 'frame-shop-void',
    label: 'Void Eclipse',
    style: 'void',
    color: '#c084fc',
    price: 900,
    category: 'frame',
    rarity: 'legendary',
    description: 'Dark eclipse frame with starfield corners.',
  },
];

export const SHOP_TITLES = [
  {
    id: 'shop-title-whale',
    label: 'Coin Whale',
    name: 'Coin Whale',
    price: 400,
    category: 'title',
    rarity: 'rare',
    description: 'Flex your economy mastery.',
  },
  {
    id: 'shop-title-phantom',
    label: 'Phantom Keys',
    name: 'Phantom Keys',
    price: 600,
    category: 'title',
    rarity: 'epic',
    description: 'Moves faster than the eye can track.',
  },
  {
    id: 'shop-title-mythic',
    label: 'Mythic Typist',
    name: 'Mythic Typist',
    price: 1000,
    category: 'title',
    rarity: 'legendary',
    description: 'The rarest title in the shop.',
  },
  {
    id: 'shop-title-blitz',
    label: 'Blitz Runner',
    name: 'Blitz Runner',
    price: 450,
    category: 'title',
    rarity: 'rare',
    description: 'Speed demon with lightning fingers.',
  },
  {
    id: 'shop-title-sage',
    label: 'Keyboard Sage',
    name: 'Keyboard Sage',
    price: 520,
    category: 'title',
    rarity: 'epic',
    description: 'Wisdom earned through endless practice.',
  },
  {
    id: 'shop-title-nova',
    label: 'Nova Striker',
    name: 'Nova Striker',
    price: 850,
    category: 'title',
    rarity: 'legendary',
    description: 'Explosive WPM energy.',
  },
];

export const SHOP_BADGES = [
  {
    id: 'icon-crown',
    label: 'Crown',
    emoji: '👑',
    price: 200,
    category: 'badge',
    rarity: 'rare',
    description: 'Royal crown badge displayed before your name.',
  },
  {
    id: 'icon-flame',
    label: 'Flame',
    emoji: '🔥',
    price: 250,
    category: 'badge',
    rarity: 'rare',
    description: 'On-fire streak energy.',
  },
  {
    id: 'icon-diamond',
    label: 'Diamond',
    emoji: '💎',
    price: 450,
    category: 'badge',
    rarity: 'epic',
    description: 'Premium sparkle badge.',
  },
  {
    id: 'icon-dragon',
    label: 'Dragon',
    emoji: '🐉',
    price: 800,
    category: 'badge',
    rarity: 'legendary',
    description: 'Ultimate prestige badge.',
  },
  {
    id: 'icon-star',
    label: 'Star',
    emoji: '⭐',
    price: 180,
    category: 'badge',
    rarity: 'rare',
    description: 'Shining star for consistent performers.',
  },
  {
    id: 'icon-bolt',
    label: 'Lightning',
    emoji: '⚡',
    price: 220,
    category: 'badge',
    rarity: 'rare',
    description: 'Electric speed badge.',
  },
  {
    id: 'icon-shield',
    label: 'Guardian',
    emoji: '🛡️',
    price: 320,
    category: 'badge',
    rarity: 'epic',
    description: 'Accuracy guardian shield.',
  },
  {
    id: 'icon-trophy',
    label: 'Champion',
    emoji: '🏆',
    price: 500,
    category: 'badge',
    rarity: 'epic',
    description: 'Champion trophy badge.',
  },
  {
    id: 'icon-rocket',
    label: 'Rocket',
    emoji: '🚀',
    price: 380,
    category: 'badge',
    rarity: 'epic',
    description: 'Launch to the leaderboard.',
  },
  {
    id: 'icon-ghost',
    label: 'Phantom',
    emoji: '👻',
    price: 420,
    category: 'badge',
    rarity: 'epic',
    description: 'Silent and impossibly fast.',
  },
];

/** @deprecated use SHOP_BADGES */
export const SHOP_ICONS = SHOP_BADGES;

export const DEFAULT_SOUND_PACK = 'sound-none';
export const DEFAULT_TRAIL = 'trail-normal';

export const SOUND_PACKS = [
  {
    id: 'sound-none',
    label: 'Silent',
    price: 0,
    defaultOwned: true,
    description: 'No keystroke sounds.',
  },
];

export const SHOP_SOUND_PACKS = [
  {
    id: 'sound-mechanical',
    label: 'Mechanical Keyboard',
    pack: 'mechanical',
    price: 350,
    category: 'sound',
    rarity: 'rare',
    description: 'Recorded mechanical switches with a deep, satisfying thock.',
  },
  {
    id: 'sound-typewriter',
    label: 'Typewriter',
    pack: 'typewriter',
    price: 300,
    category: 'sound',
    rarity: 'rare',
    description: 'Authentic vintage typewriter key strikes and carriage.',
  },
  {
    id: 'sound-laptop',
    label: 'Laptop Keyboard',
    pack: 'laptop',
    price: 280,
    category: 'sound',
    rarity: 'rare',
    description: 'Soft, crisp membrane keys from a real laptop.',
  },
];

export const TYPING_TRAILS = [
  {
    id: 'trail-normal',
    label: 'Normal text',
    style: 'normal',
    price: 0,
    defaultOwned: true,
    description: 'Standard typing colors (default).',
  },
];

export const SHOP_TYPING_TRAILS = [
  {
    id: 'trail-neon',
    label: 'Neon trail',
    style: 'neon',
    price: 300,
    category: 'trail',
    rarity: 'rare',
    description: 'Glowing cyan-magenta neon afterglow on typed letters.',
  },
  {
    id: 'trail-fire',
    label: 'Fire trail',
    style: 'fire',
    price: 350,
    category: 'trail',
    rarity: 'rare',
    description: 'Burning ember flicker on each keystroke.',
  },
  {
    id: 'trail-electric',
    label: 'Electric trail',
    style: 'electric',
    price: 400,
    category: 'trail',
    rarity: 'epic',
    description: 'Crackling blue-white electric sparks.',
  },
  {
    id: 'trail-rainbow',
    label: 'Rainbow trail',
    style: 'rainbow',
    price: 500,
    category: 'trail',
    rarity: 'epic',
    description: 'Shifting rainbow hues on recently typed characters.',
  },
];

export const SHOP_THEMES = [
  {
    id: 'shop-theme-cyberpunk',
    label: 'Cyberpunk Theme',
    themeId: 'cyberpunk',
    price: 650,
    category: 'theme',
    rarity: 'epic',
    description: 'Unlock the Cyberpunk theme instantly — neon pink and cyan.',
    preview: ['#050505', '#ff2a6d', '#05d9e8'],
  },
  {
    id: 'shop-theme-matrix',
    label: 'Matrix Theme',
    themeId: 'matrix',
    price: 700,
    category: 'theme',
    rarity: 'epic',
    description: 'Unlock the Matrix theme — green code rain aesthetic.',
    preview: ['#000000', '#003b00', '#00ff41'],
  },
  {
    id: 'shop-theme-retro',
    label: 'Retro Terminal Theme',
    themeId: 'retro',
    price: 550,
    category: 'theme',
    rarity: 'rare',
    description: 'Unlock the Retro Terminal theme — CRT phosphor glow.',
    preview: ['#0a0f0a', '#1a2e1a', '#33ff33'],
  },
  {
    id: 'shop-theme-ocean',
    label: 'Ocean Theme',
    themeId: 'ocean',
    price: 600,
    category: 'theme',
    rarity: 'epic',
    description: 'Unlock the Ocean theme — deep blue waves and bubbles.',
    preview: ['#021526', '#0a4d68', '#2dd4bf'],
  },
  {
    id: 'shop-theme-purple-neon',
    label: 'Purple Neon Theme',
    themeId: 'purple-neon',
    price: 900,
    category: 'theme',
    rarity: 'legendary',
    description: 'Unlock the Purple Neon theme — violet nightclub glow.',
    preview: ['#1e1035', '#6d28d9', '#c084fc'],
  },
];

export const ALL_SOUND_PACKS = [...SOUND_PACKS, ...SHOP_SOUND_PACKS];
export const ALL_TYPING_TRAILS = [...TYPING_TRAILS, ...SHOP_TYPING_TRAILS];

export const ALL_FRAMES = [...FRAMES, ...SHOP_FRAMES];
export const ALL_SHOP_ITEMS = [
  ...SHOP_FRAMES,
  ...SHOP_TITLES,
  ...SHOP_BADGES,
  ...SHOP_THEMES,
  ...SHOP_SOUND_PACKS,
  ...SHOP_TYPING_TRAILS,
];

export const SHOP_CATEGORIES = [
  { id: 'frame', label: 'Frames' },
  { id: 'title', label: 'Titles' },
  { id: 'badge', label: 'Badges' },
  { id: 'theme', label: 'Themes' },
  { id: 'sound', label: 'Sound Packs' },
  { id: 'trail', label: 'Typing Trails' },
];

export const getDefaultOwnedAvatars = () =>
  AVATARS.filter((item) => item.defaultOwned).map((item) => item.id);

export const getFrameById = (id) => ALL_FRAMES.find((item) => item.id === id);

export const getShopItemById = (id) => ALL_SHOP_ITEMS.find((item) => item.id === id);

export const getSoundPackById = (id) => ALL_SOUND_PACKS.find((item) => item.id === id);

export const getTrailById = (id) => ALL_TYPING_TRAILS.find((item) => item.id === id);

export const getDefaultOwnedSoundPacks = () =>
  SOUND_PACKS.filter((item) => item.defaultOwned).map((item) => item.id);

export const getDefaultOwnedTrails = () =>
  TYPING_TRAILS.filter((item) => item.defaultOwned).map((item) => item.id);

export const getAvatarById = (id) => {
  if (id === CUSTOM_AVATAR_ID) return { id: CUSTOM_AVATAR_ID, label: 'Custom', image: null };
  return AVATARS.find((item) => item.id === id);
};

export const resolveAvatarImage = (progress) => {
  if (progress?.avatarId === CUSTOM_AVATAR_ID && progress?.customAvatar) {
    return progress.customAvatar;
  }
  const avatar = getAvatarById(progress?.avatarId ?? DEFAULT_AVATAR);
  return avatar?.image ?? AVATARS[0].image;
};
