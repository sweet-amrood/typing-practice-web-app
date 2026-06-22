import { useCallback, useEffect, useRef, useState } from 'react';
import {
  connectRaceSocket,
  disconnectRaceSocket,
  getRaceSocket,
} from '../services/raceSocket';

const useRaceSocket = () => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState(null);
  const [publicRooms, setPublicRooms] = useState([]);
  const [queuePosition, setQueuePosition] = useState(null);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const socket = connectRaceSocket();
    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
      socket.emit('race:list-public-rooms');
    };
    const onDisconnect = () => setConnected(false);
    const onState = (state) => {
      setRoom(state);
      setQueuePosition(null);
    };
    const onPublicRooms = ({ rooms }) => setPublicRooms(rooms ?? []);
    const onQueue = ({ position }) => setQueuePosition(position);
    const onQueueLeft = () => setQueuePosition(null);
    const onError = ({ message }) => setError(message);
    const onLeft = () => {
      setRoom(null);
      setQueuePosition(null);
    };
    const onProgress = ({ userId, progress, wpm, accuracy }) => {
      setRoom((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          players: prev.players.map((player) =>
            player.userId === userId
              ? { ...player, progress, wpm, accuracy }
              : player
          ),
        };
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('race:state', onState);
    socket.on('race:public-rooms', onPublicRooms);
    socket.on('race:queue', onQueue);
    socket.on('race:queue-left', onQueueLeft);
    socket.on('race:error', onError);
    socket.on('race:left', onLeft);
    socket.on('race:progress', onProgress);

    if (socket.connected) {
      setConnected(true);
      socket.emit('race:list-public-rooms');
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('race:state', onState);
      socket.off('race:public-rooms', onPublicRooms);
      socket.off('race:queue', onQueue);
      socket.off('race:queue-left', onQueueLeft);
      socket.off('race:error', onError);
      socket.off('race:left', onLeft);
      socket.off('race:progress', onProgress);
      disconnectRaceSocket();
    };
  }, []);

  const emit = useCallback((event, payload) => {
    const socket = socketRef.current ?? getRaceSocket();
    socket.emit(event, payload);
  }, []);

  const joinQueue = useCallback(() => emit('race:join-queue'), [emit]);
  const leaveQueue = useCallback(() => emit('race:leave-queue'), [emit]);
  const createRoom = useCallback(
    (visibility = 'private') => emit('race:create-room', { visibility }),
    [emit]
  );
  const joinRoomByCode = useCallback(
    (roomId) => emit('race:join-room-code', { roomId: roomId.trim().toUpperCase() }),
    [emit]
  );
  const joinPublicRoom = useCallback(
    (roomId) => emit('race:join-room', { roomId: roomId.trim().toUpperCase() }),
    [emit]
  );
  const listPublicRooms = useCallback(() => emit('race:list-public-rooms'), [emit]);
  const startRace = useCallback(() => emit('race:start'), [emit]);
  const leaveRoom = useCallback(() => emit('race:leave-room'), [emit]);
  const sendProgress = useCallback(
    (payload) => emit('race:progress', payload),
    [emit]
  );
  const sendFinish = useCallback(
    (payload) => emit('race:finish', payload),
    [emit]
  );

  return {
    connected,
    room,
    publicRooms,
    queuePosition,
    error,
    clearError,
    joinQueue,
    leaveQueue,
    createRoom,
    joinRoomByCode,
    joinPublicRoom,
    listPublicRooms,
    startRace,
    leaveRoom,
    sendProgress,
    sendFinish,
  };
};

export default useRaceSocket;
