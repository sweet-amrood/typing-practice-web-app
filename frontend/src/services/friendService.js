import api from './api';

export const getFriends = async () => {
  const { data } = await api.get('/friends');
  return data.data;
};

export const searchUsers = async (query) => {
  const { data } = await api.get('/friends/search', { params: { q: query } });
  return data.data;
};

export const sendFriendRequest = async (username) => {
  const { data } = await api.post('/friends/request', { username });
  return data;
};

export const respondToFriendRequest = async (id, action) => {
  const { data } = await api.patch(`/friends/request/${id}`, { action });
  return data;
};

export const removeFriend = async (friendId) => {
  const { data } = await api.delete(`/friends/${friendId}`);
  return data;
};
