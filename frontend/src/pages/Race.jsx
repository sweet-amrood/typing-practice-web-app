import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LiveTypingStats from '../components/LiveTypingStats';
import RaceProgressBar from '../components/RaceProgressBar';
import TypingDisplay from '../components/TypingDisplay';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';
import useRaceSocket from '../hooks/useRaceSocket';
import useRaceTyping from '../hooks/useRaceTyping';
import PageTypingHeader from '../components/typing/PageTypingHeader';

const CountdownOverlay = ({ endsAt }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setSecondsLeft(remaining);
    };

    tick();
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <div className="flex min-h-[10rem] flex-col items-center justify-center rounded-xl border border-theme-border bg-theme-card/60 p-8">
      <p className="text-sm uppercase tracking-widest text-theme-muted">Get ready</p>
      <p className="mt-2 text-6xl font-bold tabular-nums text-theme-accent">
        {secondsLeft || 'Go!'}
      </p>
    </div>
  );
};

const RaceResults = ({ results, userId, localResults, onLeave }) => {
  const sorted = [...(results ?? [])].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
  const myResult = sorted.find((entry) => entry.userId === userId);
  const others = sorted.filter((entry) => entry.userId !== userId);

  return (
    <div className="space-y-4">
      {myResult && (
        <div className="rounded-xl border border-theme-accent/50 bg-theme-accent/10 p-6">
          <h2 className="text-lg font-semibold text-white">Your race results</h2>
          <p className="mt-1 text-sm text-theme-muted">
            {myResult.finished ? 'You completed the race' : 'Race ended — your progress was saved'}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-theme-muted">Rank</dt>
              <dd className="text-2xl font-bold text-theme-accent">#{myResult.rank}</dd>
            </div>
            <div>
              <dt className="text-xs text-theme-muted">WPM</dt>
              <dd className="text-2xl font-bold text-white">{localResults?.wpm ?? myResult.wpm}</dd>
            </div>
            <div>
              <dt className="text-xs text-theme-muted">Accuracy</dt>
              <dd className="text-2xl font-bold text-white">
                {localResults?.accuracy ?? myResult.accuracy}%
              </dd>
            </div>
            <div>
              <dt className="text-xs text-theme-muted">Time</dt>
              <dd className="text-lg font-semibold text-white">
                {(localResults?.duration ?? myResult.duration) ?? '—'}s
              </dd>
            </div>
            <div>
              <dt className="text-xs text-theme-muted">Progress</dt>
              <dd className="text-lg font-semibold text-white">{myResult.progress}%</dd>
            </div>
            <div>
              <dt className="text-xs text-theme-muted">Errors</dt>
              <dd className="text-lg font-semibold text-white">
                {localResults?.mistakes ?? myResult.mistakes ?? 0}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="rounded-xl border border-theme-border bg-theme-card/50 p-6">
        <h3 className="text-sm font-medium text-white">All racers</h3>
        <ol className="mt-3 space-y-2">
          {sorted.map((entry) => (
            <li
              key={entry.userId}
              className={`flex flex-wrap items-center justify-between gap-2 rounded-md border px-4 py-3 text-sm ${
                entry.userId === userId
                  ? 'border-theme-accent/30 bg-theme-accent/5'
                  : 'border-theme-border bg-theme-bg/40'
              }`}
            >
              <span className="font-medium text-white">
                #{entry.rank} {entry.username}
                {entry.userId === userId ? ' (you)' : ''}
              </span>
              <span className="tabular-nums text-theme-text-secondary">
                {entry.finished ? (
                  <>
                    {entry.wpm} WPM · {entry.accuracy}% · {entry.duration}s
                  </>
                ) : (
                  <>DNF · {entry.progress}% · {entry.wpm} WPM</>
                )}
              </span>
            </li>
          ))}
        </ol>
        {others.length === 0 && (
          <p className="mt-2 text-sm text-theme-muted">No other players in this race.</p>
        )}
      </div>

      <button
        type="button"
        onClick={onLeave}
        className="rounded-md bg-theme-accent px-4 py-2 text-sm font-medium text-white hover:bg-theme-accent-hover"
      >
        Back to lobby
      </button>
    </div>
  );
};

const Race = () => {
  const { user } = useAuth();
  const { progress } = useStats();
  const [joinCode, setJoinCode] = useState('');
  const [roomVisibility, setRoomVisibility] = useState('private');
  const {
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
  } = useRaceSocket();

  const userId = user?._id?.toString();

  const isRacing = room?.status === 'racing';
  const isHost = room?.hostId === userId;

  const localPlayer = useMemo(
    () => room?.players?.find((player) => player.userId === userId),
    [room?.players, userId]
  );

  const mergedPlayers = useMemo(() => {
    if (!room?.players) return [];
    return room.players;
  }, [room?.players]);

  const handleProgress = useCallback(
    (payload) => sendProgress(payload),
    [sendProgress]
  );

  const handleFinish = useCallback(
    (payload) => sendFinish(payload),
    [sendFinish]
  );

  const {
    input,
    started,
    finished: typingFinished,
    finishResults,
    liveStats,
    wordRanges,
    currentWordIndex,
    inputRef,
    handleInput,
  } = useRaceTyping({
    text: isRacing ? room?.text : '',
    enabled: isRacing,
    onProgress: handleProgress,
    onFinish: handleFinish,
    soundPackId: progress?.cosmetics?.activeSoundPack ?? 'sound-none',
  });

  const trailStyle = progress?.cosmetics?.trailStyle ?? 'normal';

  const inQueue = queuePosition !== null;
  const inRoom = Boolean(room);
  const showLobby = !inRoom && !inQueue;

  return (
    <section className="space-y-6">
      <PageTypingHeader
        label="Multiplayer"
        title="Race"
        subtitle="Match with players or invite friends. The race ends when anyone finishes first."
      >
        <p className="text-xs text-theme-muted">
          {connected ? '● Connected to race server' : '○ Connecting…'}
        </p>
      </PageTypingHeader>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <span>{error}</span>
          <button type="button" onClick={clearError} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {inQueue && (
        <div className="rounded-xl border border-theme-border bg-theme-card/50 p-6 text-center">
          <p className="text-white">Searching for opponents…</p>
          <p className="mt-1 text-sm text-theme-muted">Queue position: {queuePosition}</p>
          <button
            type="button"
            onClick={leaveQueue}
            className="mt-4 rounded-md border border-theme-border-strong px-4 py-2 text-sm text-theme-text-secondary hover:bg-theme-hover"
          >
            Cancel
          </button>
        </div>
      )}

      {showLobby && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-theme-border bg-theme-card/50 p-5">
              <h2 className="font-medium text-white">Quick match</h2>
              <p className="mt-1 text-sm text-theme-muted">
                Join a public room or the matchmaking queue. First finisher ends the race for everyone.
              </p>
              <button
                type="button"
                onClick={joinQueue}
                disabled={!connected}
                className="mt-4 w-full rounded-md bg-theme-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-theme-accent-hover disabled:opacity-50"
              >
                Find race
              </button>
            </div>

            <div className="rounded-xl border border-theme-border bg-theme-card/50 p-5">
              <h2 className="font-medium text-white">Create room</h2>
              <p className="mt-1 text-sm text-theme-muted">
                Public rooms appear in quick match. Private rooms require a room code.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRoomVisibility('public')}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-medium ${
                    roomVisibility === 'public'
                      ? 'bg-theme-accent text-white'
                      : 'border border-theme-border-strong text-theme-muted'
                  }`}
                >
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setRoomVisibility('private')}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-medium ${
                    roomVisibility === 'private'
                      ? 'bg-theme-accent text-white'
                      : 'border border-theme-border-strong text-theme-muted'
                  }`}
                >
                  Private
                </button>
              </div>
              <button
                type="button"
                onClick={() => createRoom(roomVisibility)}
                disabled={!connected}
                className="mt-3 w-full rounded-md border border-theme-accent px-4 py-2.5 text-sm font-medium text-theme-accent hover:bg-theme-accent/10 disabled:opacity-50"
              >
                Create {roomVisibility} room
              </button>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Private room code"
                  maxLength={6}
                  className="min-w-0 flex-1 rounded-md border border-theme-border-strong bg-theme-bg px-3 py-2 text-sm uppercase text-white outline-none focus:border-theme-accent"
                />
                <button
                  type="button"
                  onClick={() => joinRoomByCode(joinCode)}
                  disabled={!connected || joinCode.trim().length < 4}
                  className="rounded-md bg-theme-hover px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          {publicRooms.length > 0 && (
            <div className="rounded-xl border border-theme-border bg-theme-card/50 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-medium text-white">Public rooms</h2>
                <button
                  type="button"
                  onClick={listPublicRooms}
                  className="text-xs text-theme-muted hover:text-white"
                >
                  Refresh
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {publicRooms.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-theme-border bg-theme-bg/40 px-3 py-2 text-sm"
                  >
                    <div>
                      <span className="text-white">{entry.hostUsername}&apos;s room</span>
                      <span className="ml-2 text-xs text-theme-muted">
                        {entry.players}/{entry.maxPlayers} players
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => joinPublicRoom(entry.id)}
                      disabled={!connected}
                      className="rounded bg-theme-accent px-3 py-1 text-xs text-white hover:bg-theme-accent-hover"
                    >
                      Join
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {inRoom && room.status === 'waiting' && (
        <div className="space-y-4 rounded-xl border border-theme-border bg-theme-card/50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-medium text-white">
                Room {room.id}
                <span className="ml-2 text-xs font-normal text-theme-muted">
                  {room.visibility === 'public' ? 'Public' : 'Private'}
                </span>
              </h2>
              <p className="text-sm text-theme-muted">
                {room.players.length}/6 players ·{' '}
                {room.visibility === 'private'
                  ? 'share the code to invite friends'
                  : 'visible in quick match — waiting for players'}
              </p>
            </div>
          </div>

          <ul className="space-y-2">
            {room.players.map((player) => (
              <li
                key={player.userId}
                className="rounded-md border border-theme-border bg-theme-bg/40 px-3 py-2 text-sm text-white"
              >
                {player.username}
                {player.userId === room.hostId ? (
                  <span className="ml-2 text-xs text-theme-accent">host</span>
                ) : null}
                {player.userId === userId ? (
                  <span className="ml-2 text-xs text-theme-muted">(you)</span>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            {isHost ? (
              <button
                type="button"
                onClick={startRace}
                disabled={room.players.length < 2}
                className="rounded-md bg-theme-accent px-4 py-2 text-sm font-medium text-white hover:bg-theme-accent-hover disabled:opacity-50"
              >
                Start race ({room.players.length}/2 min)
              </button>
            ) : (
              <p className="text-sm text-theme-muted">Waiting for host to start…</p>
            )}
            <button
              type="button"
              onClick={leaveRoom}
              className="rounded-md border border-theme-border-strong px-4 py-2 text-sm font-medium text-theme-text-secondary transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {inRoom && room.status === 'countdown' && (
        <div className="space-y-4">
          <CountdownOverlay endsAt={room.countdownEndsAt} />
          <div className="space-y-3 rounded-xl border border-theme-border bg-theme-card/50 p-4">
            {mergedPlayers.map((player) => (
              <RaceProgressBar
                key={player.userId}
                username={player.username}
                progress={player.progress}
                wpm={player.wpm}
                finished={player.finished}
                isYou={player.userId === userId}
              />
            ))}
          </div>
        </div>
      )}

      {inRoom && room.status === 'racing' && (
        <div className="space-y-4">
          <div className="space-y-3 rounded-xl border border-theme-border bg-theme-card/50 p-4">
            {mergedPlayers.map((player) => (
              <RaceProgressBar
                key={player.userId}
                username={player.username}
                progress={
                  player.userId === userId
                    ? Math.round((input.length / (room.text?.length || 1)) * 100)
                    : player.progress
                }
                wpm={player.userId === userId ? liveStats.wpm : player.wpm}
                finished={player.finished || (player.userId === userId && typingFinished)}
                isYou={player.userId === userId}
              />
            ))}
          </div>

          <LiveTypingStats
            wpm={liveStats.wpm}
            accuracy={liveStats.accuracy}
            started={started}
            armed
          />

          <div className="rounded-xl border border-theme-border bg-theme-card/50 p-4 sm:p-6">
            <TypingDisplay
              text={room.text}
              input={input}
              currentWordIndex={currentWordIndex}
              wordRanges={wordRanges}
              trailStyle={trailStyle}
            />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              disabled={typingFinished || localPlayer?.finished}
              className="sr-only"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Race typing input"
            />
          </div>
        </div>
      )}

      {inRoom && room.status === 'finished' && (
        <RaceResults
          results={room.results}
          userId={userId}
          localResults={finishResults}
          onLeave={leaveRoom}
        />
      )}

      <p className="text-xs text-theme-muted">
        Friend requests?{' '}
        <Link to="/leaderboard#friend-requests" className="text-theme-accent hover:underline">
          Accept them on the Leaderboard page
        </Link>
        .
      </p>
    </section>
  );
};

export default Race;
