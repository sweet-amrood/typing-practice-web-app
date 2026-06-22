import { useEffect, useRef, useState } from 'react';
import { CoinIcon, XpIcon } from './RewardIcons';

export const NavbarCoinBar = ({ coins = 0 }) => (
  <div
    className="flex items-center gap-1.5 rounded-lg border border-theme-border bg-theme-bg/60 px-2.5 py-1.5"
    title="Total coins"
  >
    <CoinIcon className="h-4 w-4 text-yellow-300" />
    <span className="text-sm font-semibold tabular-nums text-yellow-200">
      {coins.toLocaleString()}
    </span>
  </div>
);

export const NavbarXpBar = ({
  level = 1,
  xp = 0,
  xpInLevel = 0,
  xpRequiredForLevel = 100,
  xpToNextLevel = 100,
  levelProgressPercent = 0,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-w-[120px] items-center gap-2 rounded-lg border border-theme-border bg-theme-bg/60 px-2.5 py-1.5 transition-colors hover:border-theme-accent/40"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-theme-accent/20 text-xs font-bold text-theme-accent">
          {level}
        </span>
        <div className="min-w-0 flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-theme-hover">
            <div
              className="h-full rounded-full bg-theme-accent transition-all"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>
        <XpIcon className="h-3.5 w-3.5 shrink-0 text-amber-300" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-theme-border bg-theme-card p-4 shadow-xl"
          role="dialog"
          aria-label="Level progress"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-theme-muted">
                Level
              </p>
              <p className="text-2xl font-bold text-white">{level}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-theme-muted">Total XP</p>
              <p className="text-lg font-semibold text-amber-300">
                {xp.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs text-theme-muted">
              <span>
                {xpInLevel} / {xpRequiredForLevel} XP
              </span>
              <span>{levelProgressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-theme-hover">
              <div
                className="h-full rounded-full bg-theme-accent"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>

          <p className="mt-4 text-sm text-theme-text-secondary">
            <span className="font-semibold text-white">{xpToNextLevel} XP</span>{' '}
            needed to reach level {level + 1}
          </p>

          <p className="mt-2 text-xs text-theme-muted">
            Earn XP from tests and lessons. Higher accuracy and speed give bonus
            rewards.
          </p>
        </div>
      )}
    </div>
  );
};
