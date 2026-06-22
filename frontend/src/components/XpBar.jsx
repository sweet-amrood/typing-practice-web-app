const XpBar = ({
  level,
  xp,
  xpInLevel,
  xpRequiredForLevel,
  xpToNextLevel,
  levelProgressPercent,
}) => (
  <div className="rounded-lg border border-theme-border bg-theme-card/50 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-theme-muted">Level</p>
        <p className="text-2xl font-bold text-white">{level}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-theme-muted">Total XP</p>
        <p className="text-lg font-semibold text-theme-accent">{xp.toLocaleString()}</p>
      </div>
    </div>

    <div className="mt-4">
      <div className="mb-2 flex justify-between text-xs text-theme-muted">
        <span>
          {xpInLevel} / {xpRequiredForLevel} XP
        </span>
        <span>{xpToNextLevel} XP to level {level + 1}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-theme-hover">
        <div
          className="h-full rounded-full bg-theme-accent transition-all duration-500"
          style={{ width: `${levelProgressPercent}%` }}
        />
      </div>
    </div>
  </div>
);

export default XpBar;
