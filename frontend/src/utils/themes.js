export const THEMES = [
  {
    id: 'dark',
    name: 'Dark',
    description: 'Clean slate dark mode',
    personality: 'Minimal stars · Space Grotesk',
    unlockHint: 'Always available',
    preview: ['#020617', '#1e293b', '#6366f1'],
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon pink and cyan on black',
    personality: 'Scanlines · skyline · neon corners',
    unlockHint: 'Reach 50 WPM',
    preview: ['#050505', '#ff2a6d', '#05d9e8'],
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Green code rain aesthetic',
    personality: 'Live code rain · mono grid',
    unlockHint: 'Maintain a 7-day streak',
    preview: ['#000000', '#003b00', '#00ff41'],
  },
  {
    id: 'retro',
    name: 'Retro Terminal',
    description: 'Classic green phosphor terminal',
    personality: 'CRT scanlines · phosphor glow · VT323',
    unlockHint: 'Complete 10 typing tests',
    preview: ['#0a0f0a', '#1a2e1a', '#33ff33'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blue and teal waves',
    personality: 'Drifting waves · rising bubbles',
    unlockHint: 'Reach player level 10',
    preview: ['#021526', '#0a4d68', '#2dd4bf'],
  },
  {
    id: 'purple-neon',
    name: 'Purple Neon',
    description: 'Violet and indigo glow',
    personality: 'Twinkling sparks · nightclub glow',
    unlockHint: 'Maintain a 30-day streak',
    preview: ['#1e1035', '#6d28d9', '#c084fc'],
  },
];

export const DEFAULT_THEME = 'dark';

const LEGACY_THEME_MAP = {
  default: 'dark',
  special: 'purple-neon',
};

export const normalizeThemeId = (themeId) =>
  LEGACY_THEME_MAP[themeId] ?? themeId ?? DEFAULT_THEME;

export const applyTheme = (themeId) => {
  document.body.dataset.theme = normalizeThemeId(themeId);
};
