import Progress from '../models/Progress.js';
import { getOrCreateProgress } from './progressRecordService.js';
import {
  computeUnlockedThemes,
  DEFAULT_THEME,
  formatThemesForUser,
  getNewlyUnlockedThemes,
  normalizeThemeId,
  THEME_IDS,
} from '../utils/themes.js';

export const syncProgressThemes = async (userId, options = {}) => {
  const { session = null, autoActivateNew = false } = options;
  const progress = await getOrCreateProgress(userId, { session });

  if (!progress) {
    return { progress: null, newlyUnlocked: [], themeData: null };
  }

  const previousUnlocked = (progress.unlockedThemes ?? [DEFAULT_THEME])
    .map(normalizeThemeId)
    .filter((id) => THEME_IDS.includes(id));
  const nextUnlocked = computeUnlockedThemes(progress);
  const newlyUnlocked = getNewlyUnlockedThemes(previousUnlocked, nextUnlocked);

  let activeTheme = normalizeThemeId(progress.activeTheme);

  if (!nextUnlocked.includes(activeTheme)) {
    activeTheme = DEFAULT_THEME;
  }

  if (autoActivateNew && newlyUnlocked.length > 0) {
    activeTheme = newlyUnlocked[newlyUnlocked.length - 1];
  }

  const unlockedChanged =
    JSON.stringify(previousUnlocked) !== JSON.stringify(nextUnlocked);
  const activeChanged = normalizeThemeId(progress.activeTheme) !== activeTheme;
  if (unlockedChanged || activeChanged) {
    progress.unlockedThemes = nextUnlocked;
    progress.activeTheme = activeTheme;

    await progress.save(session ? { session } : undefined);
  }

  return {
    progress,
    newlyUnlocked,
    themeData: formatThemesForUser(progress),
  };
};

export const setActiveTheme = async (userId, themeId) => {
  await syncProgressThemes(userId);
  const progress = await getOrCreateProgress(userId);
  const themeData = formatThemesForUser(progress);
  const normalized = normalizeThemeId(themeId);

  if (!themeData.unlockedThemes.includes(normalized)) {
    const definition = themeData.themes.find((theme) => theme.id === normalized);
    const error = new Error(
      definition
        ? `${definition.name} is locked. ${definition.unlockHint}.`
        : 'Theme is not available'
    );
    error.statusCode = 403;
    throw error;
  }

  progress.activeTheme = normalized;
  await progress.save();

  return formatThemesForUser(progress);
};
