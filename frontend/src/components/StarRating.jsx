const sizes = {
  sm: 'text-sm gap-0.5',
  md: 'text-lg gap-1',
  lg: 'text-2xl gap-1',
};

const clampStars = (value) => {
  const count = Math.round(Number(value));

  if (!Number.isFinite(count) || count < 0) {
    return 0;
  }

  return Math.min(3, count);
};

/** Shows exactly how many stars were earned (0–3 filled). */
const StarRating = ({ stars = 0, max = 3, size = 'md', showLabel = false }) => {
  const earned = clampStars(stars);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div
        className={`inline-flex items-center ${sizes[size]}`}
        aria-label={`${earned} of ${max} stars earned`}
      >
        {Array.from({ length: max }, (_, index) => {
          const filled = index < earned;

          return (
            <span
              key={index}
              className={filled ? 'text-yellow-400' : 'text-theme-border-strong'}
              aria-hidden="true"
            >
              ★
            </span>
          );
        })}
      </div>
      {showLabel && (
        <span className="text-xs text-theme-muted">
          {earned === 3
            ? 'Perfect'
            : earned === 2
              ? 'Passed'
              : earned === 1
                ? 'Keep trying'
                : 'Try again'}
        </span>
      )}
    </div>
  );
};

/** Labels a star tier requirement (not earned stars). */
export const StarTierLabel = ({ tier, size = 'sm' }) => {
  const count = clampStars(tier);

  return (
    <span
      className={`inline-flex items-center ${sizes[size]} text-theme-muted`}
      aria-hidden="true"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <span
          key={index}
          className={index < count ? 'text-theme-muted' : 'text-theme-border-strong/80'}
        >
          ★
        </span>
      ))}
    </span>
  );
};

export default StarRating;
