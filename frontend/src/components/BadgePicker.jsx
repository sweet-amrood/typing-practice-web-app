import { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateCosmetics } from '../services/shopService';

const BadgeChip = ({ active, disabled, owned, onClick, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`rounded-lg border px-3 py-2.5 text-sm transition-colors disabled:cursor-not-allowed ${
      active
        ? 'border-theme-accent bg-theme-accent/15 text-theme-accent'
        : owned
          ? 'border-theme-border text-theme-muted hover:border-theme-accent/40'
          : 'border-theme-border/60 text-theme-muted/50 opacity-60'
    }`}
  >
    {children}
  </button>
);

const BadgePicker = ({ cosmetics, onUpdate }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!cosmetics) return null;

  const badgeList = cosmetics.badges ?? cosmetics.icons ?? [];
  const equippedBadge = badgeList.find((item) => item.equipped);
  const ownedCount = badgeList.filter((item) => item.owned).length;

  const handleEquip = async (iconId) => {
    setSaving(true);
    setError(null);

    try {
      await updateCosmetics({ iconId });
      await onUpdate?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-theme-border bg-theme-card/50 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-white">Badges</h2>
          <p className="mt-1 text-xs text-theme-muted">
            Equip a badge to show it before your name on your profile and leaderboards.
          </p>
        </div>
        <p className="text-xs text-theme-muted">
          {ownedCount} of {badgeList.length} owned
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <BadgeChip
          active={!equippedBadge}
          owned
          disabled={saving}
          onClick={() => handleEquip(null)}
        >
          None
        </BadgeChip>
        {badgeList.map((badge) => (
          <BadgeChip
            key={badge.id}
            active={badge.equipped}
            owned={badge.owned}
            disabled={!badge.owned || saving}
            onClick={() => badge.owned && handleEquip(badge.id)}
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-lg">{badge.emoji}</span>
              <span>{badge.label}</span>
              {!badge.owned && <span className="text-[10px] uppercase tracking-wide">Locked</span>}
            </span>
          </BadgeChip>
        ))}
      </div>

      {ownedCount === 0 && (
        <p className="mt-3 text-xs text-theme-muted">
          No badges yet.{' '}
          <Link to="/shop" className="text-theme-accent hover:underline">
            Buy badges in the Shop
          </Link>
        </p>
      )}

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default BadgePicker;
