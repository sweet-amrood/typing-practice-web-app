import { randomBytes } from 'crypto';
import {
  generateRaceText,
  RACE_COUNTDOWN_MS,
  RACE_WORD_COUNT,
} from '../utils/raceText.js';

const rooms = new Map();
const queue = [];
const socketIndex = new Map();

const createRoomId = () => randomBytes(3).toString('hex').toUpperCase();

const serializePlayer = (player) => ({
  userId: player.userId,
  username: player.username,
  progress: player.progress,
  wpm: player.wpm,
  accuracy: player.accuracy,
  finished: player.finished,
  rank: player.rank,
  duration: player.duration ?? null,
  mistakes: player.mistakes ?? 0,
});

const serializeRoom = (room) => ({
  id: room.id,
  status: room.status,
  visibility: room.visibility,
  text: room.status === 'waiting' ? null : room.text,
  wordCount: room.wordCount,
  hostId: room.hostId,
  hostUsername: room.players.find((p) => p.userId === room.hostId)?.username ?? null,
  countdownEndsAt: room.countdownEndsAt,
  players: room.players.map(serializePlayer),
  results: room.results ?? [],
});

const getSocketRoomId = (socketId) => socketIndex.get(socketId)?.roomId ?? null;

const removeFromQueue = (socketId) => {
  const index = queue.findIndex((entry) => entry.socketId === socketId);

  if (index >= 0) {
    queue.splice(index, 1);
  }
};

const broadcastRoom = (io, room) => {
  io.to(room.id).emit('race:state', serializeRoom(room));
  broadcastPublicRooms(io);
};

const broadcastPublicRooms = (io) => {
  const publicRooms = [...rooms.values()]
    .filter((room) => room.visibility === 'public' && room.status === 'waiting')
    .map((room) => ({
      id: room.id,
      players: room.players.length,
      maxPlayers: 6,
      hostUsername: room.players.find((p) => p.userId === room.hostId)?.username ?? 'Host',
    }));

  io.emit('race:public-rooms', { rooms: publicRooms });
};

const buildResults = (room) => {
  const ranked = [...room.players].sort((a, b) => {
    if (a.finished && b.finished) return a.finishedAt - b.finishedAt;
    if (a.finished) return -1;
    if (b.finished) return 1;
    return b.progress - a.progress;
  });

  ranked.forEach((player, index) => {
    player.rank = index + 1;
  });

  return room.players.map((player) => ({
    userId: player.userId,
    username: player.username,
    wpm: player.wpm,
    accuracy: player.accuracy,
    progress: player.progress,
    duration: player.duration ?? null,
    mistakes: player.mistakes ?? 0,
    finished: player.finished,
    rank: player.rank,
  }));
};

const endRace = (io, room) => {
  if (room.status !== 'racing') {
    return;
  }

  room.status = 'finished';
  room.results = buildResults(room);
  broadcastRoom(io, room);
};

const startCountdown = (io, room) => {
  room.status = 'countdown';
  room.countdownEndsAt = Date.now() + RACE_COUNTDOWN_MS;
  broadcastRoom(io, room);

  setTimeout(() => {
    if (!rooms.has(room.id) || room.status !== 'countdown') {
      return;
    }

    room.status = 'racing';
    room.startedAt = Date.now();
    broadcastRoom(io, room);
  }, RACE_COUNTDOWN_MS);
};

const createRoom = (hostPlayer, visibility = 'private') => {
  const room = {
    id: createRoomId(),
    status: 'waiting',
    visibility: visibility === 'public' ? 'public' : 'private',
    text: generateRaceText(RACE_WORD_COUNT),
    wordCount: RACE_WORD_COUNT,
    hostId: hostPlayer.userId,
    players: [hostPlayer],
    results: [],
    countdownEndsAt: null,
    startedAt: null,
  };

  rooms.set(room.id, room);
  return room;
};

const addPlayerToRoom = (room, player) => {
  if (room.players.some((entry) => entry.userId === player.userId)) {
    return false;
  }

  if (room.players.length >= 6) {
    return false;
  }

  room.players.push(player);
  return true;
};

const findJoinablePublicRoom = () => {
  const candidates = [...rooms.values()]
    .filter(
      (room) =>
        room.visibility === 'public' &&
        room.status === 'waiting' &&
        room.players.length < 6
    )
    .sort((a, b) => b.players.length - a.players.length);

  return candidates[0] ?? null;
};

const joinPlayerToRoom = (io, socket, room, player) => {
  const added = addPlayerToRoom(room, player);

  if (!added) {
    return false;
  }

  socket.join(room.id);
  socketIndex.set(socket.id, {
    roomId: room.id,
    userId: player.userId,
  });
  broadcastRoom(io, room);
  return true;
};

const tryMatchmaking = (io) => {
  while (queue.length >= 2) {
    const matched = queue.splice(0, Math.min(4, queue.length));

    const room = createRoom(
      {
        socketId: matched[0].socketId,
        userId: matched[0].userId,
        username: matched[0].username,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        finished: false,
        rank: null,
        mistakes: 0,
      },
      'private'
    );

    for (let index = 1; index < matched.length; index += 1) {
      addPlayerToRoom(room, {
        socketId: matched[index].socketId,
        userId: matched[index].userId,
        username: matched[index].username,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        finished: false,
        rank: null,
        mistakes: 0,
      });
    }

    matched.forEach((entry) => {
      const socket = io.sockets.sockets.get(entry.socketId);

      if (socket) {
        socket.join(room.id);
        socketIndex.set(entry.socketId, {
          roomId: room.id,
          userId: entry.userId,
        });
        socket.emit('race:matched', { roomId: room.id });
      }
    });

    startCountdown(io, room);
  }
};

const leaveRoom = (io, socket) => {
  const roomId = getSocketRoomId(socket.id);
  removeFromQueue(socket.id);

  if (!roomId) {
    return;
  }

  const room = rooms.get(roomId);

  if (!room) {
    socketIndex.delete(socket.id);
    return;
  }

  room.players = room.players.filter((player) => player.socketId !== socket.id);
  socket.leave(roomId);
  socketIndex.delete(socket.id);

  if (room.players.length === 0) {
    rooms.delete(roomId);
    broadcastPublicRooms(io);
    return;
  }

  if (room.hostId === socket.data.user.id && room.status === 'waiting') {
    room.hostId = room.players[0].userId;
  }

  broadcastRoom(io, room);
};

export const initializeRaceSocket = (io) => {
  io.on('connection', (socket) => {
    const playerBase = {
      socketId: socket.id,
      userId: socket.data.user.id,
      username: socket.data.user.username,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      finished: false,
      rank: null,
      mistakes: 0,
    };

    socket.emit('race:connected', { userId: playerBase.userId });
    broadcastPublicRooms(io);

    socket.on('race:list-public-rooms', () => {
      broadcastPublicRooms(io);
    });

    socket.on('race:join-queue', () => {
      leaveRoom(io, socket);

      const publicRoom = findJoinablePublicRoom();

      if (publicRoom && joinPlayerToRoom(io, socket, publicRoom, playerBase)) {
        socket.emit('race:joined-public', { roomId: publicRoom.id });
        return;
      }

      queue.push(playerBase);
      socket.emit('race:queue', { position: queue.length });
      tryMatchmaking(io);
    });

    socket.on('race:leave-queue', () => {
      removeFromQueue(socket.id);
      socket.emit('race:queue-left');
    });

    socket.on('race:create-room', ({ visibility } = {}) => {
      leaveRoom(io, socket);
      const room = createRoom(playerBase, visibility);
      socket.join(room.id);
      socketIndex.set(socket.id, {
        roomId: room.id,
        userId: playerBase.userId,
      });
      socket.emit('race:room-created', { roomId: room.id, visibility: room.visibility });
      broadcastRoom(io, room);
    });

    socket.on('race:join-room', ({ roomId }) => {
      const room = rooms.get(roomId?.toUpperCase());

      if (!room) {
        socket.emit('race:error', { message: 'Race room not found' });
        return;
      }

      if (room.status !== 'waiting') {
        socket.emit('race:error', { message: 'Race has already started' });
        return;
      }

      if (room.visibility === 'private') {
        socket.emit('race:error', { message: 'This is a private room — join with the room code' });
        return;
      }

      leaveRoom(io, socket);

      if (!joinPlayerToRoom(io, socket, room, playerBase)) {
        socket.emit('race:error', { message: 'Unable to join room' });
      }
    });

    socket.on('race:join-room-code', ({ roomId }) => {
      const room = rooms.get(roomId?.toUpperCase());

      if (!room) {
        socket.emit('race:error', { message: 'Race room not found' });
        return;
      }

      if (room.status !== 'waiting') {
        socket.emit('race:error', { message: 'Race has already started' });
        return;
      }

      leaveRoom(io, socket);

      if (!joinPlayerToRoom(io, socket, room, playerBase)) {
        socket.emit('race:error', { message: 'Unable to join room' });
      }
    });

    socket.on('race:start', () => {
      const roomId = getSocketRoomId(socket.id);
      const room = roomId ? rooms.get(roomId) : null;

      if (!room || room.hostId !== socket.data.user.id) {
        socket.emit('race:error', { message: 'Only the host can start the race' });
        return;
      }

      if (room.players.length < 2) {
        socket.emit('race:error', { message: 'At least 2 players are required' });
        return;
      }

      room.text = generateRaceText(RACE_WORD_COUNT);
      startCountdown(io, room);
    });

    socket.on('race:progress', ({ progress, wpm, accuracy }) => {
      const roomId = getSocketRoomId(socket.id);
      const room = roomId ? rooms.get(roomId) : null;

      if (!room || room.status !== 'racing') {
        return;
      }

      const player = room.players.find((entry) => entry.socketId === socket.id);

      if (!player || player.finished) {
        return;
      }

      player.progress = Math.max(0, Math.min(100, Number(progress) || 0));
      player.wpm = Math.max(0, Number(wpm) || 0);
      player.accuracy = Math.max(0, Math.min(100, Number(accuracy) || 0));

      socket.to(room.id).emit('race:progress', {
        userId: player.userId,
        progress: player.progress,
        wpm: player.wpm,
        accuracy: player.accuracy,
      });
    });

    socket.on('race:finish', ({ wpm, accuracy, duration, mistakes }) => {
      const roomId = getSocketRoomId(socket.id);
      const room = roomId ? rooms.get(roomId) : null;

      if (!room || room.status !== 'racing') {
        return;
      }

      const player = room.players.find((entry) => entry.socketId === socket.id);

      if (!player || player.finished) {
        return;
      }

      player.finished = true;
      player.progress = 100;
      player.wpm = Math.max(0, Number(wpm) || 0);
      player.accuracy = Math.max(0, Math.min(100, Number(accuracy) || 0));
      player.finishedAt = Date.now();
      player.duration = Math.max(1, Number(duration) || 1);
      player.mistakes = Math.max(0, Number(mistakes) || 0);

      endRace(io, room);
    });

    socket.on('race:leave-room', () => {
      leaveRoom(io, socket);
      socket.emit('race:left');
    });

    socket.on('disconnect', () => {
      leaveRoom(io, socket);
    });
  });
};
