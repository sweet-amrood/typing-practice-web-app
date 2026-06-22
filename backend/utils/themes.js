import { calculateLevel } from './level.js';

export const THEME_IDS = [
  'dark',
  'cyberpunk',
  'matrix',
  'retro',
  'ocean',
  'purple-neon',
];

export const DEFAULT_THEME = 'dark';

export const THEMES = [
  {
    id: 'dark',
    name: 'Dark',
    description: 'Clean slate dark mode',
    unlockHint: 'Always available',
    isDefault: true,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon pink and cyan on black',
    unlockHint: 'Reach 50 WPM',
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Green code rain aesthetic',
    unlockHint: 'Maintain a 7-day streak',
  },
  {
    id: 'retro',
    name: 'Retro Terminal',
    description: 'Classic green phosphor terminal',
    unlockHint: 'Complete 10 typing tests',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blue and teal waves',
    unlockHint: 'Reach player level 10',
  },
  {
    id: 'purple-neon',
    name: 'Purple Neon',
    description: 'Violet and indigo glow',
    unlockHint: 'Maintain a 30-day streak',
  },
];

const LEGACY_THEME_MAP = {
  default: 'dark',
  special: 'purple-neon',
};

export const normalizeThemeId = (themeId) =>
  LEGACY_THEME_MAP[themeId] ?? (THEME_IDS.includes(themeId) ? themeId : DEFAULT_THEME);

export const isThemeUnlocked = (themeId, progress) => {
  const id = normalizeThemeId(themeId);
  return computeUnlockedThemes(progress).includes(id);
};

export const checkThemeUnlockCondition = (themeId, progress) => {
  switch (themeId) {
    case 'dark':
      return true;
    case 'cyberpunk':
      return (progress.highestWPM ?? 0) >= 50;
    case 'matrix':
      return (progress.streak ?? 0) >= 7;
    case 'retro':
      return (progress.totalTestsCompleted ?? 0) >= 10;
    case 'ocean':
      return calculateLevel(progress.xp ?? 0) >= 10;
    case 'purple-neon':
      return (
        (progress.streak ?? 0) >= 30 || Boolean(progress.specialThemeUnlocked)
      );
    default:
      return false;
  }
};

export const computeUnlockedThemes = (progress) => {
  const unlocked = new Set([DEFAULT_THEME]);

  for (const theme of THEMES) {
    if (theme.id !== DEFAULT_THEME && checkThemeUnlockCondition(theme.id, progress)) {
      unlocked.add(theme.id);
    }
  }

  for (const themeId of progress.grantedThemes ?? []) {
    const normalized = normalizeThemeId(themeId);
    if (THEME_IDS.includes(normalized)) {
      unlocked.add(normalized);
    }
  }

  return THEME_IDS.filter((id) => unlocked.has(id));
};

export const formatThemesForUser = (progress) => {
  const unlockedThemes = computeUnlockedThemes(progress);
  const activeTheme = normalizeThemeId(progress.activeTheme);

  return {
    activeTheme: unlockedThemes.includes(activeTheme)
      ? activeTheme
      : DEFAULT_THEME,
    unlockedThemes,
    themes: THEMES.map((theme) => ({
      ...theme,
      unlocked: unlockedThemes.includes(theme.id),
    })),
  };
};

export const getNewlyUnlockedThemes = (previousThemes, nextThemes) =>
  nextThemes.filter((themeId) => !previousThemes.includes(themeId));
