import api from './api';

export const getTitles = async () => {
  const { data } = await api.get('/titles');
  return data.data;
};

export const updateTitle = async (titleId) => {
  const { data } = await api.patch('/titles', { titleId });
  return data.data;
};
