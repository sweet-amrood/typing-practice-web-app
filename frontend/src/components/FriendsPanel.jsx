import { useEffect, useState } from 'react';
import {
  getFriends,
  removeFriend,
  respondToFriendRequest,
  searchUsers,
  sendFriendRequest,
} from '../services/friendService';

const FriendsPanel = ({ onFriendsChange }) => {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadFriends = async () => {
    setLoading(true);
    setError(null);

    try {
      const overview = await getFriends();
      setData(overview);
      onFriendsChange?.(overview.friends);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        const users = await searchUsers(query.trim());
        setResults(users);
      } catch {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAddFriend = async (username) => {
    setSubmitting(true);
    setError(null);

    try {
      await sendFriendRequest(username);
      setQuery('');
      setResults([]);
      await loadFriends();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespond = async (id, action) => {
    setSubmitting(true);
    setError(null);

    try {
      await respondToFriendRequest(id, action);
      await loadFriends();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (friendId) => {
    setSubmitting(true);
    setError(null);

    try {
      await removeFriend(friendId);
      await loadFriends();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !data) {
    return <p className="text-sm text-theme-muted">Loading friends...</p>;
  }

  return (
    <div id="friend-requests" className="space-y-4 rounded-xl border border-theme-border bg-theme-card/50 p-5 scroll-mt-24">
      <div>
        <h2 className="text-sm font-medium text-white">Friends</h2>
        <p className="mt-1 text-xs text-theme-muted">
          Search users to add friends. Incoming requests appear below — accept or decline here.
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {data?.incomingRequests?.length > 0 && (
        <div className="rounded-lg border border-theme-accent/40 bg-theme-accent/10 p-4">
          <h3 className="text-sm font-semibold text-theme-accent">
            Incoming friend requests ({data.incomingRequests.length})
          </h3>
          <p className="mt-1 text-xs text-theme-muted">
            Someone wants to be your friend. Accept to see them on the friends leaderboard.
          </p>
          <ul className="mt-3 space-y-2">
            {data.incomingRequests.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between gap-2 rounded-md border border-theme-border bg-theme-bg/60 px-3 py-2 text-sm"
              >
                <span className="font-medium text-white">{request.user.username}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleRespond(request.id, 'accept')}
                    className="rounded bg-theme-accent px-3 py-1 text-xs text-white hover:bg-theme-accent-hover"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleRespond(request.id, 'decline')}
                    className="rounded border border-theme-border-strong px-3 py-1 text-xs text-theme-muted hover:text-white"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search username..."
          className="w-full rounded-md border border-theme-border-strong bg-theme-bg px-3 py-2 text-sm text-white outline-none focus:border-theme-accent"
        />
        {results.length > 0 && (
          <ul className="mt-2 space-y-1 rounded-md border border-theme-border bg-theme-bg/60 p-2">
            {results.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm"
              >
                <span className="text-white">{user.username}</span>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleAddFriend(user.username)}
                  className="rounded bg-theme-accent px-2 py-1 text-xs text-white hover:bg-theme-accent-hover disabled:opacity-50"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-theme-muted">
          Your friends ({data?.friends?.length ?? 0})
        </h3>
        {!data?.friends?.length ? (
          <p className="text-sm text-theme-muted">No friends yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.friends.map((friend) => (
              <li
                key={friend.id}
                className="flex items-center justify-between gap-2 rounded-md border border-theme-border bg-theme-bg/40 px-3 py-2 text-sm"
              >
                <span className="text-white">{friend.username}</span>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleRemove(friend.id)}
                  className="text-xs text-theme-muted hover:text-red-400"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendsPanel;
