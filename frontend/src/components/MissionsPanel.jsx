import { useState } from 'react';
import { claimMission } from '../services/missionService';
import { CoinIcon, XpIcon } from './RewardIcons';

const RewardBadge = ({ reward }) => {
  if (!reward) return null;
  if (reward.type === 'coins') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-amber-300">
        <CoinIcon className="h-3.5 w-3.5" />+{reward.amount}
      </span>
    );
  }
  if (reward.type === 'xp') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-sky-300">
        <XpIcon className="h-3.5 w-3.5" />+{reward.amount} XP
      </span>
    );
  }
  return <span className="text-xs text-theme-accent">{reward.label}</span>;
};

const MissionCard = ({ mission, type, onClaim, claiming }) => {
  const progressPercent = Math.min(
    100,
    Math.round((mission.progress / mission.target) * 100)
  );

  return (
    <div className="rounded-lg border border-theme-border bg-theme-bg/40 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-white">{mission.title}</p>
          <p className="mt-0.5 text-xs text-theme-muted">{mission.description}</p>
        </div>
        <RewardBadge reward={mission.reward} />
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-theme-hover">
        <div
          className="h-full rounded-full bg-theme-accent transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-theme-muted">
        <span>
          {mission.progress} / {mission.target}
        </span>
        {mission.claimed ? (
          <span className="text-emerald-400">Claimed</span>
        ) : mission.readyToClaim ? (
          <button
            type="button"
            disabled={claiming}
            onClick={() => onClaim(type, mission.id)}
            className="rounded bg-theme-accent px-2 py-1 text-white hover:bg-theme-accent-hover disabled:opacity-50"
          >
            Claim
          </button>
        ) : (
          <span>In progress</span>
        )}
      </div>
    </div>
  );
};

const MissionsPanel = ({ missions, onUpdate }) => {
  const [claiming, setClaiming] = useState(null);
  const [error, setError] = useState(null);

  const handleClaim = async (type, missionId) => {
    setClaiming(missionId);
    setError(null);

    try {
      await claimMission(type, missionId);
      await onUpdate?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setClaiming(null);
    }
  };

  if (!missions) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-theme-border bg-theme-card/50 p-4">
        <h3 className="text-sm font-medium text-white">Daily missions</h3>
        <p className="mt-1 text-xs text-theme-muted">Refreshes every day</p>
        <div className="mt-3 space-y-2">
          {missions.daily?.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              type="daily"
              claiming={claiming === mission.id}
              onClaim={handleClaim}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-theme-border bg-theme-card/50 p-4">
        <h3 className="text-sm font-medium text-white">Weekly challenges</h3>
        <p className="mt-1 text-xs text-theme-muted">Resets each week</p>
        <div className="mt-3 space-y-2">
          {missions.weekly?.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              type="weekly"
              claiming={claiming === mission.id}
              onClaim={handleClaim}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400 lg:col-span-2">{error}</p>}
    </div>
  );
};

export default MissionsPanel;
