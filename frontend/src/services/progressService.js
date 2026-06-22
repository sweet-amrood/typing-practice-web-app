import api from './api';

export const getProgress = async () => {
  const { data } = await api.get('/progress');
  return data.data;
};

export const getStageProgress = async () => {
  const { data } = await api.get('/progress/stages');
  return data.data;
};

export const updateTheme = async (theme) => {
  const { data } = await api.patch('/progress/theme', { theme });
  return data.data;
};

export const updateLevelProgress = async ({ mode, level, wpm, accuracy }) => {
  const { data } = await api.put('/progress/stages', {
    mode,
    level,
    wpm,
    accuracy,
  });
  return data;
};

export const getDailyReward = async () => {
  const { data } = await api.get('/progress/daily-reward');
  return data.data;
};

export const collectDailyReward = async () => {
  const { data } = await api.post('/progress/daily-reward/collect');
  return data;
};
