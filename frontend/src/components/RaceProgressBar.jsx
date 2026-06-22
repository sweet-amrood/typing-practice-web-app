const RaceProgressBar = ({ username, progress, wpm, finished, isYou }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs">
      <span className={isYou ? 'font-semibold text-theme-accent' : 'text-theme-text-secondary'}>
        {username}
        {isYou ? ' (you)' : ''}
        {finished ? ' ✓' : ''}
      </span>
      <span className="tabular-nums text-theme-muted">{wpm} WPM</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-theme-hover">
      <div
        className={`h-full rounded-full transition-all duration-200 ${
          finished ? 'bg-emerald-400' : 'bg-theme-accent'
        }`}
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      />
    </div>
  </div>
);

export default RaceProgressBar;
