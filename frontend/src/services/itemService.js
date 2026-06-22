import api from './api';

export const getItems = async () => {
  const { data } = await api.get('/items');
  return data.data;
};

export const getItemById = async (id) => {
  const { data } = await api.get(`/items/${id}`);
  return data.data;
};

export const createItem = async (item) => {
  const { data } = await api.post('/items', item);
  return data.data;
};

export const updateItem = async (id, item) => {
  const { data } = await api.put(`/items/${id}`, item);
  return data.data;
};

export const deleteItem = async (id) => {
  await api.delete(`/items/${id}`);
};

export const checkHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};
