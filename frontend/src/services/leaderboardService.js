import api from './api';

export const getGlobalLeaderboard = async () => {
  const { data } = await api.get('/leaderboards/global');
  return data.data;
};

export const getWeeklyLeaderboard = async () => {
  const { data } = await api.get('/leaderboards/weekly');
  return data.data;
};

export const getFriendsLeaderboard = async () => {
  const { data } = await api.get('/leaderboards/friends');
  return data.data;
};

export const getPlayerStats = async (userId) => {
  const { data } = await api.get(`/leaderboards/player/${userId}`);
  return data.data;
};
