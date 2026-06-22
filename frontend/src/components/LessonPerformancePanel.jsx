import StarRating, { StarTierLabel } from './StarRating';

const LessonPerformancePanel = ({ lessonStars, starRequirements }) => (
  <div className="rounded-xl border border-theme-border bg-theme-card/50 p-3 sm:p-4">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-sm font-medium text-white">Star tiers</h2>
      <p className="text-xs text-theme-muted">2 stars needed to unlock next level</p>
    </div>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {[3, 2, 1].map((star) => {
        const tier = starRequirements.stars[star];
        const active = lessonStars === star;

        return (
          <div
            key={star}
            className={`rounded-lg border px-2.5 py-2.5 text-center sm:px-3 ${
              active
                ? 'border-theme-accent/40 bg-theme-accent/10'
                : 'border-theme-border bg-theme-bg/40'
            }`}
          >
            {active ? (
              <StarRating stars={lessonStars} size="sm" />
            ) : (
              <StarTierLabel tier={star} size="sm" />
            )}
            <p className="mt-1.5 text-xs font-medium text-white">{tier.label}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-theme-muted sm:text-xs">
              {tier.minWpm} WPM · {tier.minAccuracy}%
            </p>
            {active && (
              <p className="mt-1 text-[10px] font-medium text-theme-accent">
                You earned {lessonStars} star{lessonStars === 1 ? '' : 's'}
              </p>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default LessonPerformancePanel;
