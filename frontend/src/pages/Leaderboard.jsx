import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FriendsPanel from '../components/FriendsPanel';
import LeaderboardTable from '../components/LeaderboardTable';
import PageTypingHeader from '../components/typing/PageTypingHeader';
import {
  getFriendsLeaderboard,
  getGlobalLeaderboard,
  getWeeklyLeaderboard,
} from '../services/leaderboardService';

const TABS = [
  { id: 'global', label: 'Global' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'friends', label: 'Friends' },
];

const Leaderboard = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('global');
  const [entries, setEntries] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLeaderboard = async (tab) => {
    setLoading(true);
    setError(null);

    try {
      let data;

      if (tab === 'weekly') {
        data = await getWeeklyLeaderboard();
      } else if (tab === 'friends') {
        data = await getFriendsLeaderboard();
      } else {
        data = await getGlobalLeaderboard();
      }

      setEntries(data.entries);
      setMeta(data.meta);
    } catch (err) {
      setError(err.message);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard(activeTab);
  }, [activeTab]);

  return (
    <section className="space-y-6">
      <PageTypingHeader
        label="Rankings"
        title="Leaderboards"
        subtitle="Global, weekly, and friends rankings based on typing performance."
      />

      {meta?.weekStart && activeTab === 'weekly' && (
        <p className="text-xs text-theme-muted">
          Week started {new Date(meta.weekStart).toLocaleDateString()}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.filter((tab) => tab.id !== 'friends' || isAuthenticated).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-theme-accent text-white'
                : 'border border-theme-border-strong text-theme-text-secondary hover:bg-theme-hover'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {isAuthenticated && (
        <FriendsPanel onFriendsChange={() => activeTab === 'friends' && loadLeaderboard('friends')} />
      )}

      {activeTab === 'friends' && !isAuthenticated && (
        <p className="text-sm text-theme-muted">Log in to view friends rankings.</p>
      )}

      {loading ? (
        <p className="text-sm text-theme-muted">Loading rankings...</p>
      ) : (
        <LeaderboardTable entries={entries} weekly={activeTab === 'weekly'} />
      )}
    </section>
  );
};

export default Leaderboard;
