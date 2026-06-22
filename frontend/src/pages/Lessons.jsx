import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LevelCard from '../components/LevelCard';
import { StarTierLabel } from '../components/StarRating';
import { getStageProgress } from '../services/progressService';

const sumCategoryStars = (levels) =>
  levels.reduce((total, level) => total + (level.stars ?? 0), 0);

const Lessons = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const progress = await getStageProgress();
      setData(progress);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, location.pathname, location.key]);

  if (loading && !data) {
    return <p className="py-20 text-center text-sm text-theme-muted">Loading...</p>;
  }

  if (error && !data) {
    return <p className="py-20 text-center text-sm text-red-400">{error}</p>;
  }

  if (!data) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Lessons</h1>
          <p className="mt-1 text-sm text-theme-muted">
            {data.totalCompleted} of {data.totalLevels} levels completed
          </p>
        </div>
        <p className="text-sm text-theme-muted">
          Earn 2+ stars to unlock the next level
        </p>
      </div>

      <p className="text-sm text-theme-muted">
        Each difficulty has 30 levels. Completed levels show how many stars you
        earned. Earn at least 2 stars to unlock the next level.
      </p>

      {data.categories.map((category) => {
        const totalStars = sumCategoryStars(category.levels);
        const maxStars = category.completedCount * 3;

        return (
          <div
            key={category.mode}
            className="rounded-lg border border-theme-border bg-theme-card/50 p-5"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-medium text-white">{category.name}</h2>
                <p className="mt-1 text-xs text-theme-muted">
                  {category.completedCount} / {data.levelsPerMode} completed
                  {category.currentLevel
                    ? ` · Current: Level ${category.currentLevel}`
                    : ' · All levels complete'}
                </p>
                {category.completedCount > 0 && (
                  <p className="mt-1 text-xs text-yellow-400/90">
                    ★ {totalStars} stars earned
                    {maxStars > 0 ? ` (${totalStars}/${maxStars})` : ''}
                  </p>
                )}
              </div>
              {category.currentLevel && (
                <Link
                  to={`/test?mode=${category.mode}&level=${category.currentLevel}`}
                  className="rounded-md bg-theme-accent px-4 py-2 text-sm font-medium text-white hover:bg-theme-accent-hover"
                >
                  Continue
                </Link>
              )}
            </div>

            <div className="mb-4 grid gap-2 sm:grid-cols-3">
              {[3, 2, 1].map((star) => (
                <div
                  key={star}
                  className="rounded-lg border border-theme-border bg-theme-bg/40 px-3 py-2 text-xs text-theme-muted"
                >
                  <div className="flex items-center gap-2">
                    <StarTierLabel tier={star} size="sm" />
                    <span className="text-theme-text-secondary">
                      {category.starRequirements.stars[star].label}
                    </span>
                  </div>
                  <p className="mt-1">
                    {category.starRequirements.stars[star].minWpm} WPM ·{' '}
                    {category.starRequirements.stars[star].minAccuracy}% accuracy
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
              {category.levels.map((level) => (
                <LevelCard key={`${level.mode}-${level.level}`} level={level} />
              ))}
            </div>
          </div>
        );
      })}

      <Link
        to="/test"
        className="inline-block text-sm text-theme-accent hover:text-theme-accent-hover"
      >
        Go to free practice →
      </Link>
    </section>
  );
};

export default Lessons;
