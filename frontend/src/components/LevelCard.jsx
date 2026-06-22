import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const LockIcon = () => (
  <svg
    className="h-3.5 w-3.5 text-theme-muted"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="h-3.5 w-3.5 text-emerald-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const LevelCard = ({ level }) => {
  const baseClass =
    'flex h-14 flex-col items-center justify-center rounded-md border text-xs font-medium transition-colors';
  const earnedStars = Math.min(3, Math.max(0, Math.round(Number(level.stars)) || 0));

  if (!level.unlocked) {
    return (
      <div
        className={`${baseClass} cursor-not-allowed border-theme-border/60 bg-theme-card/30 text-theme-muted opacity-50`}
        aria-disabled="true"
        title={`Level ${level.level} locked`}
      >
        <LockIcon />
      </div>
    );
  }

  if (level.completed) {
    return (
      <Link
        to={`/test?mode=${level.mode}&level=${level.level}`}
        className={`${baseClass} border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20`}
        title={
          earnedStars > 0
            ? `Level ${level.level} — ${earnedStars} star${earnedStars === 1 ? '' : 's'} earned`
            : `Level ${level.level} — completed`
        }
      >
        {earnedStars > 0 ? (
          <StarRating stars={earnedStars} size="sm" />
        ) : (
          <CheckIcon />
        )}
        <span className="mt-0.5 text-[10px] font-semibold tabular-nums text-emerald-200">
          {level.level}
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={`/test?mode=${level.mode}&level=${level.level}`}
      className={`${baseClass} h-12 border-theme-border-strong bg-theme-card/50 text-theme-text-secondary hover:border-theme-accent/50 hover:bg-theme-card`}
      title={`Level ${level.level}`}
    >
      {level.level}
    </Link>
  );
};

export default LevelCard;
