import api from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
};

export const register = async (username, email, password) => {
  const { data } = await api.post('/auth/register', {
    username,
    email,
    password,
  });
  return data.data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data;
};

export const updateProfile = async (profile) => {
  const { data } = await api.put('/auth/me', profile);
  return data.data;
};
