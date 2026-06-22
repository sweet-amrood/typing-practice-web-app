export const XpIcon = ({ className = 'h-4 w-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
    />
  </svg>
);

export const CoinIcon = ({ className = 'h-4 w-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="8" />
    <path strokeLinecap="round" d="M12 8v8M9 10.5h5a2 2 0 010 3H9" />
  </svg>
);

export const RewardRow = ({ xp, coins, className = '' }) => (
  <div className={`flex flex-wrap items-center gap-4 ${className}`}>
    <span className="inline-flex items-center gap-1.5 text-amber-300">
      <XpIcon />
      <span className="font-semibold">+{xp}</span>
      <span className="text-xs text-amber-300/70">XP</span>
    </span>
    <span className="inline-flex items-center gap-1.5 text-yellow-300">
      <CoinIcon />
      <span className="font-semibold">+{coins}</span>
      <span className="text-xs text-yellow-300/70">coins</span>
    </span>
  </div>
);
