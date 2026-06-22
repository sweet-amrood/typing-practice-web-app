const LiveTypingStats = ({ wpm, accuracy, started, armed }) => {
  if (!armed) return null;

  const accuracyColor =
    accuracy >= 95 ? 'text-emerald-400' : accuracy >= 80 ? 'text-amber-300' : 'text-red-400';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-theme-border bg-theme-card/80 px-4 py-2.5">
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-theme-muted">WPM</p>
          <p className="text-xl font-bold tabular-nums text-theme-accent">
            {started ? wpm : '—'}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-theme-muted">
            Accuracy
          </p>
          <p className={`text-xl font-bold tabular-nums ${accuracyColor}`}>
            {started || accuracy < 100 ? `${accuracy}%` : '100%'}
          </p>
        </div>
      </div>
      <p className="text-xs text-theme-muted">Live stats update as you type</p>
    </div>
  );
};

export default LiveTypingStats;
