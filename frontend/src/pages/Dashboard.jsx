import { useState } from 'react';
import DailyRewardModal from '../components/DailyRewardModal';
import MissionsPanel from '../components/MissionsPanel';
import StreakCard from '../components/StreakCard';
import TestHistoryTable from '../components/TestHistoryTable';
import XpBar from '../components/XpBar';
import AccuracyOverTimeChart from '../components/charts/AccuracyOverTimeChart';
import ChartCard from '../components/charts/ChartCard';
import DailyActivityChart from '../components/charts/DailyActivityChart';
import WeeklyActivityChart from '../components/charts/WeeklyActivityChart';
import WpmOverTimeChart from '../components/charts/WpmOverTimeChart';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';

const Stat = ({ label, value }) => (
  <div className="rounded-lg border border-theme-border bg-theme-card/50 px-4 py-3">
    <p className="text-xs text-theme-muted">{label}</p>
    <p className="mt-1 text-xl font-semibold text-white">{value}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const {
    progress,
    history,
    timeSeries,
    dailyActivity,
    weeklyActivity,
    loading,
    error,
    refreshStats,
  } = useStats();

  if (loading && !progress) {
    return <p className="py-20 text-center text-sm text-theme-muted">Loading...</p>;
  }

  if (error && !progress) {
    return <p className="py-20 text-center text-sm text-red-400">{error}</p>;
  }

  if (!progress) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Hi, {user?.username}
          </h1>
          <p className="mt-1 text-sm text-theme-muted">Your typing analytics</p>
        </div>
        <button
          type="button"
          onClick={refreshStats}
          className="rounded-md border border-theme-border-strong px-3 py-1.5 text-xs text-theme-text-secondary hover:bg-theme-hover"
        >
          Refresh stats
        </button>
      </div>

      <XpBar
        level={progress.currentLevel}
        xp={progress.xp}
        xpInLevel={progress.xpInLevel}
        xpRequiredForLevel={progress.xpRequiredForLevel}
        xpToNextLevel={progress.xpToNextLevel}
        levelProgressPercent={progress.levelProgressPercent}
      />

      <StreakCard
        streak={progress.streak}
        purpleNeonUnlocked={progress.unlockedThemes?.includes('purple-neon')}
        onOpenRewards={() => setStreakModalOpen(true)}
      />

      <MissionsPanel missions={progress.missions} onUpdate={refreshStats} />

      <DailyRewardModal
        open={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Highest WPM" value={progress.highestWPM} />
        <Stat label="Average WPM" value={Number(progress.averageWPM).toFixed(1)} />
        <Stat label="Accuracy" value={`${progress.bestAccuracy}%`} />
        <Stat
          label="Total Words"
          value={progress.totalWordsTyped.toLocaleString()}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="WPM over time"
          emptyMessage={timeSeries.length ? null : 'No test data yet'}
        >
          {timeSeries.length > 0 && <WpmOverTimeChart data={timeSeries} />}
        </ChartCard>

        <ChartCard
          title="Accuracy over time"
          emptyMessage={timeSeries.length ? null : 'No test data yet'}
        >
          {timeSeries.length > 0 && (
            <AccuracyOverTimeChart data={timeSeries} />
          )}
        </ChartCard>

        <ChartCard
          title="Daily activity"
          emptyMessage={dailyActivity.length ? null : 'No test data yet'}
        >
          {dailyActivity.length > 0 && (
            <DailyActivityChart data={dailyActivity} />
          )}
        </ChartCard>

        <ChartCard
          title="Weekly activity"
          emptyMessage={weeklyActivity.length ? null : 'No test data yet'}
        >
          {weeklyActivity.length > 0 && (
            <WeeklyActivityChart data={weeklyActivity} />
          )}
        </ChartCard>
      </div>

      <div className="rounded-lg border border-theme-border bg-theme-card/50 p-4">
        <h2 className="mb-4 text-sm font-medium text-white">Test history</h2>
        <TestHistoryTable history={history} />
      </div>
    </section>
  );
};

export default Dashboard;
