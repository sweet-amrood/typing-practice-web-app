import api from './api';

export const getHistory = async () => {
  const { data } = await api.get('/results/history');
  return data.data;
};

export const getDailyActivity = async () => {
  const { data } = await api.get('/results/activity');
  return data.data;
};

export const getWeeklyActivity = async () => {
  const { data } = await api.get('/results/activity/weekly');
  return data.data;
};

export const submitResult = async ({
  wpm,
  accuracy,
  mistakes,
  duration,
  charactersTyped,
  passed,
  analytics,
  mode,
  language,
}) => {
  const { data } = await api.post('/results', {
    wpm,
    accuracy,
    mistakes,
    duration,
    charactersTyped,
    passed,
    analytics,
    mode,
    language,
  });
  return data.data;
};
