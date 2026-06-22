import { io } from 'socket.io-client';
import { TOKEN_KEY } from './api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || undefined;

let socket = null;

export const getRaceSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  const token = localStorage.getItem(TOKEN_KEY);

  socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  return socket;
};

export const connectRaceSocket = () => {
  const client = getRaceSocket();
  client.auth = { token: localStorage.getItem(TOKEN_KEY) };

  if (!client.connected) {
    client.connect();
  }

  return client;
};

export const disconnectRaceSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
