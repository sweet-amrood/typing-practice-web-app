import api from './api';

export const getMissions = async () => {
  const { data } = await api.get('/missions');
  return data.data;
};

export const claimMission = async (type, missionId) => {
  const { data } = await api.post('/missions/claim', { type, missionId });
  return data.data;
};
