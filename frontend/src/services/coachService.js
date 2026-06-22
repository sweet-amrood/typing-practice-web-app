import api from './api';

export const getCoachInsights = async () => {
  const { data } = await api.get('/coach');
  return data.data;
};

export const getPersonalizedPracticeText = async (wordCount = null) => {
  const { data } = await api.get('/coach/personalized-text', {
    params: wordCount ? { wordCount } : undefined,
  });
  return data.data;
};

export const completeCoachExercise = async () => {
  const { data } = await api.post('/coach/exercise-complete');
  return data.data;
};
