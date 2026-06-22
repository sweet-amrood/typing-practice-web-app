import api from './api';

export const getShop = async () => {
  const { data } = await api.get('/shop');
  return data.data;
};

export const buyShopItem = async (itemId) => {
  const { data } = await api.post('/shop/buy', { itemId });
  return data.data;
};

export const updateCosmetics = async (payload) => {
  const { data } = await api.patch('/shop/cosmetics', payload);
  return data.data;
};

export const getCosmetics = async () => {
  const { data } = await api.get('/shop/cosmetics');
  return data.data;
};

export const uploadCustomAvatar = async (imageData) => {
  const { data } = await api.post('/shop/avatar', { imageData });
  return data.data;
};
