import { updateTheme } from '../services/progressService';

const StreakCard = ({ streak, purpleNeonUnlocked, onOpenRewards }) => (
  <div className="rounded-lg border border-theme-border bg-theme-card/50 p-5">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-theme-muted">
          Daily Streak
        </p>
        <p className="mt-1 text-3xl font-bold text-white">{streak} days</p>
      </div>
      <button
        type="button"
        onClick={onOpenRewards}
        className="rounded-md bg-theme-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-theme-accent-hover"
      >
        View 7-day rewards
      </button>
    </div>

    <ul className="mt-4 space-y-2 text-xs text-theme-muted">
      <li className={streak >= 1 ? 'text-emerald-400' : ''}>
        ✓ Daily login — escalating coins (10–50)
      </li>
      <li className={streak >= 7 ? 'text-emerald-400' : ''}>
        ✓ 7 days — Matrix theme + streak badge
      </li>
      <li className={purpleNeonUnlocked ? 'text-emerald-400' : ''}>
        ✓ 30 days — Purple Neon theme
      </li>
    </ul>
  </div>
);

export default StreakCard;

export const handleThemeUpdate = async (theme, onSuccess) => {
  const data = await updateTheme(theme);
  onSuccess?.(data);
};
