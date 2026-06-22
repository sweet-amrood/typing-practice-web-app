import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChartCard from './charts/ChartCard';
import TestResultChart from './charts/TestResultChart';
import LessonPerformancePanel from './LessonPerformancePanel';
import LevelUpModal from './LevelUpModal';
import { getEquippedCosmeticsView } from '../utils/cosmetics';
import { RewardRow } from './RewardIcons';
import StarRating from './StarRating';
import { useStats } from '../context/StatsContext';
import { MODE_LABELS } from '../utils/lessonText';
import {
  calculateLessonStars,
  formatStarRequirements,
  MIN_STARS_TO_UNLOCK,
} from '../utils/lessonStars';
import { getTierStyle } from '../utils/rewardTiers';

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-theme-border bg-theme-bg/50 px-3 py-3 text-center sm:px-4 sm:py-4">
    <p className="text-[10px] uppercase tracking-wider text-theme-muted sm:text-xs">
      {label}
    </p>
    <p className="mt-1 text-xl font-bold tabular-nums text-white sm:mt-2 sm:text-3xl">
      {value}
    </p>
  </div>
);

const ResultsScreen = ({
  results,
  onRetry,
  onClose,
  saving,
  saveError,
  savedData,
  lessonResult,
  isLesson,
  lessonMode,
  lessonLevel,
  nextLevel,
  levelUp = null,
}) => {
  const { progress, refreshStats } = useStats();
  const [levelUpDismissed, setLevelUpDismissed] = useState(false);

  useEffect(() => {
    if (levelUp) {
      refreshStats();
      setLevelUpDismissed(false);
    }
  }, [levelUp, refreshStats]);

  if (!results) return null;

  const tier = savedData?.rewards?.tier ?? 'failed';
  const tierStyle = getTierStyle(tier);
  const xp = savedData?.rewards?.xpEarned ?? 0;
  const coins = savedData?.rewards?.coinsEarned ?? 0;
  const attemptStars = isLesson
    ? (lessonResult?.attemptStars ??
      calculateLessonStars(lessonMode, results.wpm, results.accuracy))
    : null;
  const lessonStars = isLesson
    ? (lessonResult?.stars ?? attemptStars)
    : null;
  const passed = isLesson
    ? lessonStars >= MIN_STARS_TO_UNLOCK
    : tier !== 'failed';
  const computedNextLevel =
    isLesson && lessonLevel < 30 ? lessonLevel + 1 : null;
  const nextLevelTarget = nextLevel ?? computedNextLevel;
  const showNextLevel = isLesson && passed && nextLevelTarget;
  const starRequirements = isLesson ? formatStarRequirements(lessonMode) : null;

  if (isLesson) {
    return (
      <>
        {levelUp && !levelUpDismissed && (
          <LevelUpModal
            event={levelUp}
            cosmetics={getEquippedCosmeticsView(progress?.cosmetics)}
            onClose={() => setLevelUpDismissed(true)}
          />
        )}
      <section className="mx-auto max-w-3xl space-y-5">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-theme-accent">
            {MODE_LABELS[lessonMode]} · Level {lessonLevel}
          </p>
          <div className="mt-4 flex justify-center">
            <StarRating stars={lessonStars ?? 0} size="lg" showLabel />
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            {passed ? 'Level complete' : 'Level incomplete'}
          </h1>
          <p className="mt-2 text-sm text-theme-muted">
            {lessonResult?.message ||
              (passed
                ? lessonStars === 3
                  ? 'Perfect run — all 3 stars earned.'
                  : 'Good work — the next level is unlocked.'
                : `Earn at least ${MIN_STARS_TO_UNLOCK} stars to continue.`)}
          </p>
          {attemptStars !== null &&
            attemptStars !== lessonStars &&
            attemptStars > 0 && (
              <p className="mt-1 text-xs text-theme-muted">
                This run: {attemptStars} star{attemptStars === 1 ? '' : 's'} · Best
                kept: {lessonStars} star{lessonStars === 1 ? '' : 's'}
              </p>
            )}
          {!passed && lessonResult?.message && (
            <p className="mt-2 text-sm text-amber-300">{lessonResult.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="WPM" value={results.wpm} />
          <StatCard label="Accuracy" value={`${results.accuracy}%`} />
          <StatCard label="Errors" value={results.mistakes} />
          <StatCard label="Time" value={`${results.duration}s`} />
        </div>

        <LessonPerformancePanel
          lessonStars={lessonStars}
          starRequirements={starRequirements}
        />

        <div className="rounded-xl border border-theme-border bg-theme-card/50 p-4 sm:p-5">
          <h2 className="text-sm font-medium text-white">Rewards</h2>
          {saving ? (
            <p className="mt-3 text-sm text-theme-muted">Calculating rewards...</p>
          ) : (
            <div className="mt-3">
              <RewardRow xp={xp} coins={coins} />
            </div>
          )}
          {saveError && (
            <p className="mt-3 text-sm text-red-400">{saveError}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {showNextLevel && (
            <Link
              to={`/test?mode=${lessonMode}&level=${nextLevelTarget}`}
              className="rounded-md bg-emerald-500 py-3 text-center text-sm font-medium text-white hover:bg-emerald-400 sm:flex-1"
            >
              Next level ({nextLevelTarget})
            </Link>
          )}
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md bg-theme-accent py-3 text-sm font-medium text-white hover:bg-theme-accent-hover sm:flex-1"
          >
            Restart lesson
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-theme-border-strong py-3 text-sm text-theme-text-secondary hover:bg-theme-hover sm:flex-1"
          >
            Back to lessons
          </button>
        </div>
      </section>
      </>
    );
  }

  return (
    <>
      {levelUp && !levelUpDismissed && (
        <LevelUpModal
          event={levelUp}
          cosmetics={getEquippedCosmeticsView(progress?.cosmetics)}
          onClose={() => setLevelUpDismissed(true)}
        />
      )}
    <section className="mx-auto max-w-3xl space-y-6">
      <div className={`rounded-xl border px-5 py-4 ${tierStyle.bg}`}>
        <p className={`text-xs uppercase tracking-wider ${tierStyle.accent}`}>
          {savedData?.rewards?.tierLabel ?? tierStyle.label}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Test complete</h1>
        <p className="mt-1 text-sm text-theme-muted">{tierStyle.title}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="WPM" value={results.wpm} />
        <StatCard label="Accuracy" value={`${results.accuracy}%`} />
        <StatCard label="Errors typed" value={results.mistakes} />
        <StatCard label="Time" value={`${results.duration}s`} />
      </div>

      <ChartCard
        title="Test performance"
        description="Breakdown of this test run"
        contentClassName="min-h-56 sm:min-h-64"
      >
        <TestResultChart results={results} />
      </ChartCard>

      <div className="rounded-xl border border-theme-border bg-theme-card/50 p-5">
        <h2 className="text-sm font-medium text-white">Rewards</h2>
        {saving ? (
          <p className="mt-3 text-sm text-theme-muted">Calculating rewards...</p>
        ) : (
          <div className="mt-3">
            <RewardRow xp={xp} coins={coins} />
          </div>
        )}
        {saveError && (
          <p className="mt-3 text-sm text-red-400">{saveError}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 rounded-md bg-theme-accent py-3 text-sm font-medium text-white hover:bg-theme-accent-hover"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-md border border-theme-border-strong py-3 text-sm text-theme-text-secondary hover:bg-theme-hover"
        >
          New practice
        </button>
      </div>
    </section>
    </>
  );
};

export default ResultsScreen;
