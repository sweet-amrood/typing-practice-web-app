import { useEffect, useState } from 'react';
import { CoinIcon } from './RewardIcons';
import { useStats } from '../context/StatsContext';
import {
  collectDailyReward,
  getDailyReward,
} from '../services/progressService';

const dayStyles = {
  completed: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  ready: 'border-theme-accent bg-theme-accent/20 text-theme-text-secondary ring-2 ring-theme-accent/50',
  current: 'border-theme-accent/40 bg-theme-accent/10 text-theme-accent',
  locked: 'border-theme-border bg-theme-bg/50 text-theme-muted',
};

const StreakDayBox = ({ day }) => (
  <div
    className={`flex min-w-0 flex-1 flex-col items-center rounded-lg border px-1.5 py-2.5 text-center transition-colors sm:px-2 ${dayStyles[day.status]}`}
  >
    <span className="text-[11px] font-medium uppercase tracking-wide">
      Day {day.day}
    </span>
    <span className="mt-1.5 text-xl leading-none">
      {day.status === 'completed' ? '✓' : day.status === 'ready' ? '★' : '○'}
    </span>
    <span className="mt-2 flex items-center gap-0.5 text-xs font-medium tabular-nums">
      <CoinIcon className="h-3.5 w-3.5" />
      {day.coins}
    </span>
    {day.bonus && (
      <span className="mt-1 text-[10px] leading-tight opacity-90">{day.bonus}</span>
    )}
  </div>
);

const DailyRewardModal = ({ open, onClose }) => {
  const { refreshStats } = useStats();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getDailyReward();
        setStatus(data);
      } catch {
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open]);

  const handleCollect = async () => {
    setCollecting(true);
    setMessage(null);

    try {
      const result = await collectDailyReward();
      setMessage(result.message);
      setStatus(result.data);
      await refreshStats();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setCollecting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-theme-bg/85 px-4 py-6">
      <div className="w-full max-w-lg rounded-xl border border-theme-border bg-theme-card p-5 shadow-2xl sm:p-6">
        <p className="text-xs uppercase tracking-wider text-theme-accent">
          Daily streak
        </p>
        <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
          {loading ? '...' : `${status?.streak ?? 0} day streak`}
        </h2>
        <p className="mt-1 text-xs text-theme-muted">
          Rewards grow each day — collect up to 50 coins on day 7
        </p>

        {!loading && status && (
          <>
            <div className="mt-4 rounded-xl border border-theme-border bg-theme-bg/40 p-3 sm:p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-theme-muted">
                7-day reward track
              </p>
              <div className="flex gap-1.5 sm:gap-2">
                {(status.sevenDayCalendar ?? []).map((day) => (
                  <StreakDayBox key={day.day} day={day} />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-theme-muted">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  Completed
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-theme-accent" />
                  Today
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-theme-border" />
                  Locked
                </span>
              </div>
            </div>

            {status.themeMilestone && (
              <div
                className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
                  status.themeMilestone.unlocked
                    ? 'border-theme-accent/30 bg-theme-accent/10 text-theme-accent'
                    : 'border-theme-border bg-theme-bg/50 text-theme-muted'
                }`}
              >
                Day {status.themeMilestone.day}: {status.themeMilestone.label}
                {status.themeMilestone.unlocked ? ' — unlocked' : ' — keep going'}
              </div>
            )}

            <div className="mt-3 rounded-lg border border-theme-border bg-theme-bg/50 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-yellow-300">
                <CoinIcon />
                <span className="font-semibold">
                  Today: +{status.rewardAmount} coins
                </span>
              </div>
              <p className="mt-1.5 text-xs text-theme-muted">
                {status.canCollect
                  ? 'Your daily reward is ready to collect.'
                  : status.practicedToday
                    ? 'Daily reward already collected.'
                    : 'Complete a test today to unlock your daily reward.'}
              </p>
            </div>

            {message && (
              <p className="mt-3 text-sm text-emerald-400">{message}</p>
            )}
          </>
        )}

        <div className="mt-5 flex gap-3">
          {status?.canCollect && (
            <button
              type="button"
              onClick={handleCollect}
              disabled={collecting}
              className="flex-1 rounded-md bg-theme-accent py-2 text-sm font-medium text-white hover:bg-theme-accent-hover disabled:opacity-60"
            >
              {collecting ? 'Collecting...' : 'Collect reward'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-theme-border-strong py-2 text-sm text-theme-text-secondary hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyRewardModal;
