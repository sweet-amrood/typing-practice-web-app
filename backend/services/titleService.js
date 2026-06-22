import Progress from '../models/Progress.js';
import { getOrCreateProgress } from './progressRecordService.js';
import {
  computeUnlockedTitles,
  DEFAULT_TITLE,
  formatTitlesForUser,
  getNewlyUnlockedTitles,
  normalizeTitleId,
  TITLE_IDS,
  TITLES,
} from '../utils/titles.js';

export const syncProgressTitles = async (userId, options = {}) => {
  const { session = null } = options;
  const progress = await getOrCreateProgress(userId, { session });

  if (!progress) {
    return { progress: null, newlyUnlocked: [], titleData: null };
  }

  const previousUnlocked = (progress.unlockedTitles ?? [DEFAULT_TITLE])
    .map(normalizeTitleId)
    .filter((id) => TITLE_IDS.includes(id));
  const nextUnlocked = computeUnlockedTitles(progress);
  const newlyUnlocked = getNewlyUnlockedTitles(previousUnlocked, nextUnlocked);

  let activeTitle = normalizeTitleId(progress.activeTitle);

  if (!nextUnlocked.includes(activeTitle)) {
    activeTitle = DEFAULT_TITLE;
  }

  const unlockedChanged =
    JSON.stringify(previousUnlocked) !== JSON.stringify(nextUnlocked);
  const activeChanged = normalizeTitleId(progress.activeTitle) !== activeTitle;

  if (unlockedChanged || activeChanged) {
    progress.unlockedTitles = nextUnlocked;
    progress.activeTitle = activeTitle;
    await progress.save(session ? { session } : undefined);
  }

  return {
    progress,
    newlyUnlocked,
    titleData: formatTitlesForUser(progress),
  };
};

export const setActiveTitle = async (userId, titleId) => {
  await syncProgressTitles(userId);
  const progress = await getOrCreateProgress(userId);
  const titleData = formatTitlesForUser(progress);
  const normalized = normalizeTitleId(titleId);

  if (!titleData.unlockedTitles.includes(normalized)) {
    const definition = TITLES.find((title) => title.id === normalized);
    const error = new Error(
      definition
        ? `${definition.name} is locked. ${definition.unlockHint}.`
        : 'Title is not available'
    );
    error.statusCode = 403;
    throw error;
  }

  progress.activeTitle = normalized;
  await progress.save();

  return formatTitlesForUser(progress);
};
