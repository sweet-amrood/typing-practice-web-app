import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlayerStats } from '../services/leaderboardService';
import { getFriends, sendFriendRequest } from '../services/friendService';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';
import UserAvatar from './UserAvatar';
import UserDisplayName from './UserDisplayName';

const Stat = ({ label, value }) => (
  <div className="rounded-lg border border-theme-border bg-theme-bg/40 px-3 py-2.5">
    <dt className="text-xs text-theme-muted">{label}</dt>
    <dd className="mt-0.5 text-lg font-semibold tabular-nums text-white">{value}</dd>
  </div>
);

const COMPARE_METRICS = [
  { key: 'currentLevel', label: 'Level', higherIsBetter: true },
  { key: 'highestWPM', label: 'Best WPM', higherIsBetter: true },
  { key: 'averageWPM', label: 'Avg WPM', higherIsBetter: true, format: (v) => Number(v).toFixed(1) },
  { key: 'bestAccuracy', label: 'Best accuracy', higherIsBetter: true, format: (v) => `${v}%` },
  { key: 'averageAccuracy', label: 'Avg accuracy', higherIsBetter: true, format: (v) => `${Number(v).toFixed(1)}%` },
  { key: 'totalTestsCompleted', label: 'Tests', higherIsBetter: true },
  { key: 'streak', label: 'Streak', higherIsBetter: true, format: (v) => `${v} days` },
  { key: 'lessonsCompleted', label: 'Lessons', higherIsBetter: true },
  { key: 'xp', label: 'XP', higherIsBetter: true, format: (v) => Number(v).toLocaleString() },
];

const formatMetricValue = (metric, value) =>
  metric.format ? metric.format(value ?? 0) : (value ?? 0);

const StatsCompare = ({ you, them, theirName }) => (
  <div className="rounded-lg border border-theme-border bg-theme-bg/30 p-4">
    <h3 className="text-sm font-medium text-white">Compare stats</h3>
    <p className="mt-0.5 text-xs text-theme-muted">You vs {theirName}</p>
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[280px] text-sm">
        <thead>
          <tr className="border-b border-theme-border text-left text-xs text-theme-muted">
            <th className="pb-2 pr-3 font-medium">Stat</th>
            <th className="pb-2 pr-3 font-medium">You</th>
            <th className="pb-2 font-medium">{theirName}</th>
          </tr>
        </thead>
        <tbody>
          {COMPARE_METRICS.map((metric) => {
            const yourValue = you?.[metric.key] ?? 0;
            const theirValue = them?.[metric.key] ?? 0;
            const youWin = metric.higherIsBetter
              ? yourValue > theirValue
              : yourValue < theirValue;
            const theyWin = metric.higherIsBetter
              ? theirValue > yourValue
              : theirValue < yourValue;

            return (
              <tr key={metric.key} className="border-b border-theme-border/40 last:border-b-0">
                <td className="py-2 pr-3 text-theme-text-secondary">{metric.label}</td>
                <td
                  className={`py-2 pr-3 tabular-nums ${
                    youWin ? 'font-semibold text-emerald-400' : 'text-white'
                  }`}
                >
                  {formatMetricValue(metric, yourValue)}
                </td>
                <td
                  className={`py-2 tabular-nums ${
                    theyWin ? 'font-semibold text-emerald-400' : 'text-white'
                  }`}
                >
                  {formatMetricValue(metric, theirValue)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const resolveFriendStatus = (overview, targetUserId) => {
  if (!overview || !targetUserId) return 'none';

  if (overview.friends?.some((friend) => friend.id === targetUserId)) {
    return 'friends';
  }
  if (overview.outgoingRequests?.some((request) => request.user.id === targetUserId)) {
    return 'pending_sent';
  }
  if (overview.incomingRequests?.some((request) => request.user.id === targetUserId)) {
    return 'pending_received';
  }

  return 'none';
};

const PlayerStatsModal = ({ userId, username, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { progress } = useStats();
  const [stats, setStats] = useState(null);
  const [friendsOverview, setFriendsOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendMessage, setFriendMessage] = useState(null);
  const [friendLoading, setFriendLoading] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  const isSelf = user?._id === userId;

  const friendStatus = useMemo(
    () => resolveFriendStatus(friendsOverview, userId),
    [friendsOverview, userId]
  );

  useEffect(() => {
    if (!userId) return undefined;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPlayerStats(userId);
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  useEffect(() => {
    if (!isAuthenticated || isSelf) {
      setFriendsOverview(null);
      return undefined;
    }

    let cancelled = false;

    const loadFriends = async () => {
      try {
        const data = await getFriends();
        if (!cancelled) setFriendsOverview(data);
      } catch {
        if (!cancelled) setFriendsOverview(null);
      }
    };

    loadFriends();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isSelf, userId]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleAddFriend = async () => {
    if (!stats?.username || friendStatus !== 'none') return;
    setFriendLoading(true);
    setFriendMessage(null);

    try {
      await sendFriendRequest(stats.username);
      setFriendMessage('Friend request sent!');
      const data = await getFriends();
      setFriendsOverview(data);
    } catch (err) {
      setFriendMessage(err.response?.data?.message || err.message);
    } finally {
      setFriendLoading(false);
    }
  };

  const cosmetics = stats?.cosmetics;
  const displayName = stats?.username ?? username;
  const badgeEmoji = stats?.badgeEmoji ?? cosmetics?.badgeEmoji;

  const yourCompareStats = progress
    ? {
        currentLevel: progress.currentLevel,
        highestWPM: progress.highestWPM,
        averageWPM: progress.averageWPM,
        bestAccuracy: progress.bestAccuracy,
        averageAccuracy: progress.averageAccuracy ?? 0,
        totalTestsCompleted: progress.totalTestsCompleted,
        streak: progress.streak,
        lessonsCompleted: progress.lessonsCompleted ?? 0,
        xp: progress.xp,
      }
    : null;

  const renderFriendAction = () => {
    if (friendStatus === 'friends') {
      return (
        <span className="inline-flex items-center rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
          Already friends
        </span>
      );
    }

    if (friendStatus === 'pending_sent') {
      return (
        <span className="inline-flex items-center rounded-md border border-theme-border bg-theme-bg/40 px-3 py-1.5 text-xs text-theme-muted">
          Request pending
        </span>
      );
    }

    if (friendStatus === 'pending_received') {
      return (
        <Link
          to="/leaderboard#friend-requests"
          onClick={onClose}
          className="rounded-md border border-theme-accent/40 bg-theme-accent/10 px-3 py-1.5 text-xs font-medium text-theme-accent hover:bg-theme-accent/20"
        >
          Respond to request
        </Link>
      );
    }

    return (
      <button
        type="button"
        disabled={friendLoading}
        onClick={handleAddFriend}
        className="rounded-md bg-theme-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-theme-accent-hover disabled:opacity-50"
      >
        Add friend
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-theme-bg/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-theme-border bg-theme-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="player-stats-title"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-4">
            <UserAvatar
              image={cosmetics?.avatarImage}
              frameStyle={cosmetics?.frameStyle ?? 'slate'}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <UserDisplayName
                as="h2"
                id="player-stats-title"
                name={displayName}
                badgeEmoji={badgeEmoji}
                title={stats?.titleName}
                nameClassName="text-xl font-semibold text-white"
                titleClassName="text-sm text-theme-accent"
              />
              {stats?.memberSince && (
                <p className="mt-1 text-xs text-theme-muted">
                  Member since{' '}
                  {new Date(stats.memberSince).toLocaleDateString(undefined, {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md border border-theme-border-strong px-2 py-1 text-sm text-theme-muted hover:text-white"
          >
            Close
          </button>
        </div>

        {loading && (
          <p className="mt-6 text-sm text-theme-muted">Loading player stats...</p>
        )}

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        {stats && !loading && (
          <div className="mt-5 space-y-5">
            {!isSelf && isAuthenticated && (
              <div className="flex flex-wrap gap-2">
                {renderFriendAction()}
                <button
                  type="button"
                  onClick={() => setShowCompare((value) => !value)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    showCompare
                      ? 'border-theme-accent bg-theme-accent/15 text-theme-accent'
                      : 'border-theme-border-strong text-theme-text-secondary hover:bg-theme-hover'
                  }`}
                >
                  {showCompare ? 'Hide compare' : 'Compare stats'}
                </button>
                <Link
                  to="/race"
                  onClick={onClose}
                  className="rounded-md border border-theme-border-strong px-3 py-1.5 text-xs text-theme-text-secondary hover:bg-theme-hover"
                >
                  Challenge to race
                </Link>
              </div>
            )}
            {friendMessage && (
              <p className="text-xs text-theme-accent">{friendMessage}</p>
            )}

            {showCompare && !isSelf && isAuthenticated && yourCompareStats && (
              <StatsCompare
                you={yourCompareStats}
                them={stats}
                theirName={displayName}
              />
            )}

            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="Level" value={stats.currentLevel} />
              <Stat label="Best WPM" value={stats.highestWPM} />
              <Stat label="Avg WPM" value={stats.averageWPM} />
              <Stat label="Best accuracy" value={`${stats.bestAccuracy}%`} />
              <Stat label="Avg accuracy" value={`${stats.averageAccuracy ?? 0}%`} />
              <Stat label="Tests" value={stats.totalTestsCompleted} />
              <Stat label="Words typed" value={stats.totalWordsTyped.toLocaleString()} />
              <Stat label="Streak" value={`${stats.streak} days`} />
              <Stat label="Lessons done" value={stats.lessonsCompleted} />
              <Stat label="XP" value={stats.xp.toLocaleString()} />
            </dl>

            {stats.recentTests?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white">Recent tests</h3>
                <ul className="mt-2 space-y-2">
                  {stats.recentTests.map((test) => (
                    <li
                      key={`${test.date}-${test.wpm}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-theme-border bg-theme-bg/40 px-3 py-2 text-sm"
                    >
                      <span className="text-theme-text-secondary">
                        {new Date(test.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="tabular-nums text-white">
                        {test.wpm} WPM · {test.accuracy}% · {test.duration}s
                      </span>
                      <span className="text-xs capitalize text-theme-muted">
                        {test.rewardTier}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerStatsModal;
