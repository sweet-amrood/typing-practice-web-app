import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CodeTypingDisplay from '../components/CodeTypingDisplay';
import LiveTypingStats from '../components/LiveTypingStats';
import ModeSelector from '../components/ModeSelector';
import ResultsScreen from '../components/ResultsScreen';
import TypingDisplay from '../components/TypingDisplay';
import useTypingTest from '../hooks/useTypingTest';
import { useStats } from '../context/StatsContext';
import { updateLevelProgress } from '../services/progressService';
import { submitResult } from '../services/resultService';
import { getPersonalizedPracticeText } from '../services/coachService';
import { generateLessonText, MODE_LABELS } from '../utils/lessonText';
import {
  calculateLessonStars,
  MIN_STARS_TO_UNLOCK,
} from '../utils/lessonStars';
import {
  canRefreshContent,
} from '../utils/typingText';
import {
  getCareerLabel,
  getInterestLabel,
} from '../utils/practicePreferences';
import {
  DEFAULT_MODE,
  buildMode,
  getModeDescription,
  getTimerDisplay,
} from '../utils/typingModes';
import { CODE_LANGUAGES } from '../utils/codeSnippets';
import { buildSyntaxClasses } from '../utils/syntaxHighlight';
import TypingCaret from '../components/typing/TypingCaret';

const VALID_MODES = ['beginner', 'intermediate', 'advanced'];

const Stat = ({ label, value }) => (
  <div className="text-center">
    <p className="text-xs text-theme-muted">{label}</p>
    <p className="mt-0.5 text-lg font-semibold text-white">{value}</p>
  </div>
);

const TypingTest = () => {
  const navigate = useNavigate();
  const { progress, refreshStats } = useStats();
  const [searchParams] = useSearchParams();
  const lessonMode = searchParams.get('mode');
  const lessonLevel = Number(searchParams.get('level'));
  const isLesson =
    VALID_MODES.includes(lessonMode) &&
    Number.isInteger(lessonLevel) &&
    lessonLevel >= 1 &&
    lessonLevel <= 30;

  const lessonText = useMemo(
    () => (isLesson ? generateLessonText(lessonMode, lessonLevel) : null),
    [isLesson, lessonMode, lessonLevel]
  );

  const lessonTypingMode = useMemo(
    () => ({
      id: 'lesson',
      category: 'lesson',
      type: 'words',
      count: lessonText?.trim().split(/\s+/).filter(Boolean).length ?? 0,
      label: 'Lesson',
      capitals: true,
    }),
    [lessonText]
  );

  const [mode, setMode] = useState(() => {
    const initialMode = searchParams.get('mode');
    if (initialMode === 'code') {
      return buildMode({ type: 'code', language: 'javascript', duration: 60 });
    }
    return DEFAULT_MODE;
  });
  const activeMode = isLesson ? lessonTypingMode : mode;
  const isCodeMode = !isLesson && mode.type === 'code';
  const isPersonalized = !isLesson && Boolean(mode.personalized);
  const [personalizedText, setPersonalizedText] = useState(null);
  const [personalizedMeta, setPersonalizedMeta] = useState(null);
  const [personalizedLoading, setPersonalizedLoading] = useState(false);
  const [personalizedError, setPersonalizedError] = useState(null);
  const prismLang =
    CODE_LANGUAGES.find((lang) => lang.id === (mode.language ?? 'javascript'))
      ?.prismLang ?? 'javascript';
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [lessonResult, setLessonResult] = useState(null);
  const savedRef = useRef(false);

  const personalizedWordCount = useMemo(() => {
    if (mode.type === 'words') return mode.count;
    return Math.max(35, Math.round(mode.duration * 2));
  }, [mode.type, mode.count, mode.duration]);

  const fetchPersonalizedText = useCallback(async () => {
    setPersonalizedLoading(true);
    setPersonalizedError(null);

    try {
      const data = await getPersonalizedPracticeText(personalizedWordCount);
      setPersonalizedText(data.text);
      setPersonalizedMeta(data);
      return data.text;
    } catch (err) {
      setPersonalizedError(err.message);
      return null;
    } finally {
      setPersonalizedLoading(false);
    }
  }, [personalizedWordCount]);

  useEffect(() => {
    if (!isPersonalized) {
      setPersonalizedText(null);
      setPersonalizedMeta(null);
      setPersonalizedError(null);
      return;
    }

    fetchPersonalizedText();
  }, [isPersonalized, fetchPersonalizedText]);

  const {
    text,
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
    changeContent,
  } = useTypingTest(activeMode, {
    initialText: isLesson ? lessonText : personalizedText,
    lessonMode: isLesson,
    autoStart: !isLesson,
    analyticsMode: isCodeMode ? 'code' : 'practice',
    waitForCustomText: isPersonalized && !personalizedText,
    soundPackId: progress?.cosmetics?.activeSoundPack ?? 'sound-none',
  });

  const trailStyle = progress?.cosmetics?.trailStyle ?? 'normal';

  const syntaxClasses = useMemo(() => {
    if (!isCodeMode || !text) return [];
    return buildSyntaxClasses(text, prismLang);
  }, [isCodeMode, text, prismLang]);

  const canSwitchMode = !isLesson && (!started || finished);
  const canChangeContent =
    !isLesson &&
    !started &&
    !finished &&
    (isPersonalized || canRefreshContent(mode));
  const inputDisabled = finished;

  useEffect(() => {
    savedRef.current = false;
    setSaveError(null);
    setSavedData(null);
    setLessonResult(null);
  }, [lessonMode, lessonLevel, mode.type, mode.duration, mode.count, mode.punctuation, mode.numbers, mode.capitals, mode.personalized]);

  const handleRefreshContent = async () => {
    if (isPersonalized) {
      const nextText = await fetchPersonalizedText();
      if (nextText) resetTest(nextText);
      return;
    }

    changeContent();
  };

  useEffect(() => {
    if (!results || savedRef.current) return;

    savedRef.current = true;

    const save = async () => {
      setSaving(true);
      setSaveError(null);

      const stars = isLesson
        ? calculateLessonStars(lessonMode, results.wpm, results.accuracy)
        : 0;
      const meetsReqs = isLesson
        ? stars >= MIN_STARS_TO_UNLOCK
        : true;

      try {
        const data = await submitResult({
          wpm: results.wpm,
          accuracy: results.accuracy,
          mistakes: results.mistakes,
          duration: results.duration,
          charactersTyped: results.charactersTyped,
          passed: meetsReqs,
          analytics: results.analytics,
          mode: isCodeMode ? 'code' : 'practice',
          language: isCodeMode ? mode.language : undefined,
        });
        setSavedData(data);
        await refreshStats();

        if (isLesson) {
          try {
            const levelData = await updateLevelProgress({
              mode: lessonMode,
              level: lessonLevel,
              wpm: results.wpm,
              accuracy: results.accuracy,
            });
            const bestStars = levelData.data?.stars ?? stars;
            setLessonResult({
              success: bestStars >= MIN_STARS_TO_UNLOCK,
              message: levelData.message,
              unlockedLevel: levelData.data?.unlockedLevel,
              stars: bestStars,
              attemptStars: stars,
              improved: levelData.data?.improved ?? false,
            });
            await refreshStats();
          } catch (lessonError) {
            setLessonResult({
              success: false,
              message: lessonError.message,
              stars,
              attemptStars: stars,
            });
          }
        }
      } catch (err) {
        savedRef.current = false;
        setSaveError(err.message);
      } finally {
        setSaving(false);
      }
    };

    save();
  }, [results, isLesson, lessonMode, lessonLevel, refreshStats]);

  const handleModeChange = (nextMode) => {
    if (!canSwitchMode) return;
    setMode(nextMode);
    setSaveError(null);
  };

  const handleRetry = () => {
    savedRef.current = false;
    setSaveError(null);
    setSavedData(null);
    setLessonResult(null);
    resetTest(isLesson ? lessonText : null);
  };

  const handleClose = () => {
    if (isLesson) {
      navigate('/lessons');
      return;
    }

    handleRetry();
  };

  if (finished && results) {
    return (
      <ResultsScreen
        results={results}
        saving={saving}
        saveError={saveError}
        savedData={savedData}
        lessonResult={lessonResult}
        isLesson={isLesson}
        lessonMode={lessonMode}
        lessonLevel={lessonLevel}
        nextLevel={lessonResult?.unlockedLevel}
        levelUp={savedData?.levelUp}
        onRetry={handleRetry}
        onClose={handleClose}
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          {isLesson ? (
            <>
              <Link
                to="/lessons"
                className="text-xs text-theme-accent hover:text-theme-accent-hover"
              >
                ← Back to lessons
              </Link>
              <h1 className="mt-2 text-2xl font-semibold text-white">
                {MODE_LABELS[lessonMode]} · Level {lessonLevel}
              </h1>
              <p className="mt-1 text-sm text-theme-muted">
                Earn at least 2 stars to unlock the next level
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 rounded-md border border-theme-border-strong px-3 py-1.5 text-xs text-theme-text-secondary hover:bg-theme-hover"
              >
                Restart lesson
              </button>
            </>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-theme-border bg-gradient-to-r from-theme-accent/10 via-theme-card/60 to-theme-bg px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-theme-accent">
                Practice mode
                <TypingCaret />
              </p>
              <p className="mt-1 text-sm text-theme-muted">{getModeDescription(mode)}</p>
              {isPersonalized && personalizedMeta && (
                <p className="mt-2 text-xs text-theme-accent/90">
                  Tailored from your interests
                  {personalizedMeta.meta?.interests?.length
                    ? `: ${personalizedMeta.meta.interests.map(getInterestLabel).join(', ')}`
                    : ''}
                  {personalizedMeta.meta?.careerGoal
                    ? ` · ${getCareerLabel(personalizedMeta.meta.careerGoal)}`
                    : ''}
                  {personalizedMeta.meta?.focusKeys?.length
                    ? ` · weak keys: ${personalizedMeta.meta.focusKeys.join(', ')}`
                    : ''}
                </p>
              )}
            </div>
          )}
        </div>
        <p className="font-mono text-3xl font-bold tabular-nums text-theme-accent">
          {getTimerDisplay(activeMode, liveStats.elapsedSeconds, started)}
        </p>
      </div>

      {!isLesson && (
        <div className="rounded-xl border border-theme-border bg-theme-card/30 p-3">
          <ModeSelector
            mode={mode}
            onChange={handleModeChange}
            disabled={!canSwitchMode}
          />
          {!canSwitchMode && (
            <p className="mt-2 px-1 text-xs text-theme-muted">
              Finish or reset the test to change modes
            </p>
          )}
          {isPersonalized && (
            <p className="mt-2 px-1 text-xs text-theme-muted">
              Set interests, career goal, and difficulty in your{' '}
              <Link to="/profile" className="text-theme-accent hover:underline">
                profile
              </Link>
              . Weak keys come from your coach stats.
            </p>
          )}
          {personalizedError && (
            <p className="mt-2 px-1 text-xs text-red-400">{personalizedError}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 rounded-lg border border-theme-border bg-theme-card/50 px-4 py-3 sm:grid-cols-5">
        <Stat label="WPM" value={liveStats.wpm} />
        <Stat label="Accuracy" value={`${liveStats.accuracy}%`} />
        <Stat label="Errors typed" value={liveStats.mistakes} />
        <Stat label="Chars" value={liveStats.charactersTyped} />
        <Stat label="Time" value={`${liveStats.elapsedSeconds}s`} />
      </div>

      {canChangeContent && !started && (
        <div>
          <button
            type="button"
            onClick={handleRefreshContent}
            disabled={personalizedLoading}
            className="rounded-md border border-theme-border-strong px-4 py-2 text-sm text-theme-text-secondary hover:bg-theme-hover disabled:opacity-50"
          >
            {personalizedLoading ? 'Generating...' : 'Change'}
          </button>
          <p className="mt-2 text-xs text-theme-muted">
            {isPersonalized
              ? 'Generate a new passage from your profile and weak keys.'
              : 'Click the text area and start typing — the timer begins on your first keystroke.'}
          </p>
        </div>
      )}

      <LiveTypingStats
        wpm={liveStats.wpm}
        accuracy={liveStats.accuracy}
        started={started}
        armed={armed || !isLesson}
      />

      <div
        className={`relative overflow-hidden rounded-xl border border-theme-border bg-theme-card/50 p-6 sm:p-8 ${
          inputDisabled ? 'cursor-default' : 'cursor-text'
        } ${isCodeMode ? 'bg-theme-bg/80' : ''}`}
        onClick={() => {
          if (!inputDisabled && !personalizedLoading) inputRef.current?.focus({ preventScroll: true });
        }}
      >
        {isPersonalized && personalizedLoading && (
          <p className="py-16 text-center text-sm text-theme-muted">
            Generating personalized practice text...
          </p>
        )}

        {!(isPersonalized && personalizedLoading) && (
          <>
        {isCodeMode ? (
          <CodeTypingDisplay text={text} input={input} syntaxClasses={syntaxClasses} />
        ) : (
          <TypingDisplay
            text={text}
            input={input}
            currentWordIndex={currentWordIndex}
            wordRanges={wordRanges}
            trailStyle={trailStyle}
          />
        )}

        {isCodeMode ? (
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            disabled={inputDisabled}
            tabIndex={0}
            className="absolute inset-0 z-10 h-full w-full cursor-text resize-none opacity-0"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Code typing input"
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            disabled={inputDisabled}
            tabIndex={0}
            className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Typing input"
          />
        )}
          </>
        )}
      </div>
    </section>
  );
};

export default TypingTest;
