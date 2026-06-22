import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LiveTypingStats from '../components/LiveTypingStats';
import TypingDisplay from '../components/TypingDisplay';
import useTypingTest from '../hooks/useTypingTest';
import { useStats } from '../context/StatsContext';
import { getCoachInsights } from '../services/coachService';
import { submitResult } from '../services/resultService';
import { buildMode } from '../utils/typingModes';
import PageTypingHeader from '../components/typing/PageTypingHeader';

const InsightCard = ({ title, children }) => (
  <div className="rounded-xl border border-theme-border bg-theme-card/50 p-4">
    <h3 className="text-sm font-medium text-white">{title}</h3>
    <div className="mt-3">{children}</div>
  </div>
);

const BarRow = ({ label, value, suffix = '%' }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-theme-text-secondary">{label}</span>
      <span className="tabular-nums text-theme-muted">
        {value}
        {suffix}
      </span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-theme-hover">
      <div
        className="h-full rounded-full bg-theme-accent"
        style={{ width: `${Math.min(100, Number(value) || 0)}%` }}
      />
    </div>
  </div>
);

const Coach = () => {
  const { progress, refreshStats } = useStats();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exercising, setExercising] = useState(false);
  const [saving, setSaving] = useState(false);

  const exerciseMode = useMemo(
    () => buildMode({ type: 'words', count: 25, punctuation: true }),
    []
  );

  const {
    text: exerciseText,
    input,
    armed,
    started,
    finished,
    results,
    liveStats,
    wordRanges,
    currentWordIndex,
    inputRef,
    handleInput,
    resetTest,
    startTest,
  } = useTypingTest(exerciseMode, {
    initialText: null,
    analyticsMode: 'coach',
    isCoachExercise: true,
    soundPackId: progress?.cosmetics?.activeSoundPack ?? 'sound-none',
  });

  const trailStyle = progress?.cosmetics?.trailStyle ?? 'normal';

  const loadInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCoachInsights();
      setInsights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  useEffect(() => {
    if (insights?.exercise?.text && exercising) {
      resetTest(insights.exercise.text);
      startTest();
    }
  }, [exercising, insights?.exercise?.text]);

  useEffect(() => {
    if (!finished || !results || !exercising) return;

    const save = async () => {
      setSaving(true);

      try {
        await submitResult({
          wpm: results.wpm,
          accuracy: results.accuracy,
          mistakes: results.mistakes,
          duration: results.duration,
          charactersTyped: results.charactersTyped,
          passed: true,
          analytics: { ...results.analytics, isCoachExercise: true },
          mode: 'coach',
        });
        await refreshStats();
        await loadInsights();
      } catch (err) {
        setError(err.message);
      } finally {
        setSaving(false);
        setExercising(false);
      }
    };

    save();
  }, [finished, results, exercising]);

  const startExercise = () => {
    if (!insights?.exercise?.text) return;
    setExercising(true);
  };

  if (loading && !insights) {
    return <p className="py-20 text-center text-sm text-theme-muted">Analyzing your typing...</p>;
  }

  return (
    <section className="space-y-6">
      <PageTypingHeader
        label="AI analysis"
        title="Coach"
        subtitle="Personalized analysis of weak keys, accuracy patterns, speed drops, and finger weaknesses."
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      {!insights?.hasData && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          Complete a few practice tests to unlock full coaching insights. Basic tips will appear as you type more.
        </div>
      )}

      {insights?.tips?.length > 0 && (
        <InsightCard title="Coach tips">
          <ul className="space-y-2 text-sm text-theme-text-secondary">
            {insights.tips.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
        </InsightCard>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <InsightCard title="Weak keys">
          {!insights?.weakKeys?.length ? (
            <p className="text-sm text-theme-muted">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {insights.weakKeys.map((item) => (
                <BarRow
                  key={item.key}
                  label={`"${item.label}" (${item.fingerLabel})`}
                  value={item.errorRate}
                />
              ))}
            </ul>
          )}
        </InsightCard>

        <InsightCard title="Finger weaknesses">
          {!insights?.weakFingers?.length ? (
            <p className="text-sm text-theme-muted">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {insights.weakFingers.map((item) => (
                <BarRow key={item.finger} label={item.label} value={item.errorRate} />
              ))}
            </ul>
          )}
        </InsightCard>

        <InsightCard title="Accuracy patterns">
          {!insights?.accuracyPatterns?.length ? (
            <p className="text-sm text-theme-muted">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {insights.accuracyPatterns.map((pattern) => (
                <BarRow
                  key={pattern.id}
                  label={pattern.label}
                  value={pattern.errorRate ?? 0}
                />
              ))}
            </ul>
          )}
        </InsightCard>

        <InsightCard title="Speed drops">
          <p className="text-3xl font-bold tabular-nums text-theme-accent">
            {insights?.speedDrops ?? 0}
          </p>
          <p className="mt-1 text-xs text-theme-muted">
            Times your WPM fell 15+ between samples across all tracked tests.
          </p>
          <p className="mt-3 text-sm text-theme-text-secondary">
            Keystrokes analyzed: {insights?.totalKeystrokes ?? 0}
          </p>
        </InsightCard>
      </div>

      <div className="rounded-xl border border-theme-border bg-theme-card/50 p-5">
        <h2 className="text-sm font-medium text-white">Personalized exercise</h2>
        <p className="mt-1 text-xs text-theme-muted">
          Generated from your weakest keys and fingers. Complete it to count toward the Coach Graduate title.
        </p>

        {insights?.exercise ? (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              {insights.exercise.focusKeys.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-theme-border px-2 py-0.5 text-xs text-theme-accent"
                >
                  {key}
                </span>
              ))}
              {insights.exercise.focusFingers.map((finger) => (
                <span
                  key={finger}
                  className="rounded-full border border-theme-border px-2 py-0.5 text-xs text-theme-muted"
                >
                  {finger}
                </span>
              ))}
            </div>

            {!exercising ? (
              <button
                type="button"
                onClick={startExercise}
                className="mt-4 rounded-md bg-theme-accent px-4 py-2 text-sm font-medium text-white hover:bg-theme-accent-hover"
              >
                Start exercise
              </button>
            ) : (
              <div className="mt-4 space-y-4">
                <LiveTypingStats
                  wpm={liveStats.wpm}
                  accuracy={liveStats.accuracy}
                  started={started}
                  armed={armed}
                />
                <div className="rounded-lg border border-theme-border bg-theme-bg/40 p-4">
                  <TypingDisplay
                    text={exerciseText}
                    input={input}
                    currentWordIndex={currentWordIndex}
                    wordRanges={wordRanges}
                    trailStyle={trailStyle}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => handleInput(e.target.value)}
                    disabled={finished || saving}
                    className="sr-only"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                {saving && (
                  <p className="text-sm text-theme-muted">Saving exercise results...</p>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="mt-3 text-sm text-theme-muted">
            Practice more to generate a custom drill.
          </p>
        )}

        <p className="mt-4 text-xs text-theme-muted">
          Exercises completed: {insights?.exercisesCompleted ?? 0} ·{' '}
          <Link to="/test" className="text-theme-accent hover:underline">
            Do a practice test
          </Link>{' '}
          or{' '}
          <Link to="/test?mode=code" className="text-theme-accent hover:underline">
            try programming mode
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Coach;
