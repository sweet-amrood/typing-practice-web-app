import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  calculateLiveAccuracy,
  calculateMistakes,
  calculateWpm,
  countCorrectCharacters,
  createKeystrokeTracker,
  exportTypingAnalytics,
  getCurrentWordIndex,
  getWordRanges,
  sampleWpm,
  trackKeystrokeChange,
} from '../utils/typingStats';
import { generateTextForMode } from '../utils/typingText';
import { playKeystrokeSound, warmSoundPack } from '../utils/keyboardSounds';

const useTypingTest = (mode, {
  initialText = null,
  lessonMode = false,
  autoStart = false,
  analyticsMode = 'practice',
  isCoachExercise = false,
  waitForCustomText = false,
  soundPackId = 'sound-none',
} = {}) => {
  const initialPayload = initialText
    ? { text: initialText, contentIndex: null }
    : waitForCustomText
      ? { text: '', contentIndex: null }
      : generateTextForMode(mode);

  const [text, setText] = useState(initialPayload.text);
  const [contentIndex, setContentIndex] = useState(initialPayload.contentIndex);
  const punctIndexRef = useRef(initialPayload.punctIndex ?? null);
  const numberIndexRef = useRef(initialPayload.numberIndex ?? null);
  const [input, setInput] = useState('');
  const isReady = lessonMode || autoStart;
  const [armed, setArmed] = useState(isReady);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [results, setResults] = useState(null);
  const startTimeRef = useRef(null);
  const inputRef = useRef(null);
  const inputValueRef = useRef('');
  const finishingRef = useRef(false);
  const keystrokeTrackerRef = useRef(createKeystrokeTracker());

  const wordRanges = useMemo(() => getWordRanges(text), [text]);
  const currentWordIndex = getCurrentWordIndex(input.length, wordRanges);

  const resetTracker = () => {
    keystrokeTrackerRef.current = createKeystrokeTracker();
  };

  const finishTest = useCallback(
    (finalInput, elapsed) => {
      if (finishingRef.current) return;
      finishingRef.current = true;

      const duration = Math.max(1, elapsed);
      const tracker = keystrokeTrackerRef.current;
      const correctCharacters = countCorrectCharacters(finalInput, text);
      const wpm = calculateWpm(correctCharacters, duration);
      const accuracy = calculateLiveAccuracy(
        tracker.totalKeystrokes,
        tracker.errorKeystrokes
      );
      const mistakes = tracker.errorKeystrokes;

      setResults({
        wpm,
        accuracy,
        mistakes,
        totalKeystrokes: tracker.totalKeystrokes,
        charactersTyped: finalInput.length,
        duration,
        analytics: exportTypingAnalytics(tracker, {
          mode: analyticsMode,
          isCoachExercise,
        }),
      });
      setFinished(true);
      setElapsedSeconds(duration);
    },
    [text, analyticsMode, isCoachExercise]
  );

  const applyText = useCallback((payload) => {
    setText(payload.text);
    setContentIndex(payload.contentIndex ?? null);
    punctIndexRef.current = payload.punctIndex ?? null;
    numberIndexRef.current = payload.numberIndex ?? null;
  }, []);

  const createPayload = useCallback(
    (excludeCurrent = false) =>
      generateTextForMode(mode, {
        contentIndex: excludeCurrent && mode.type === 'quote' ? contentIndex : null,
        punctIndex: excludeCurrent ? punctIndexRef.current : null,
        numberIndex: excludeCurrent ? numberIndexRef.current : null,
      }),
    [contentIndex, mode]
  );

  const resetTest = useCallback(
    (nextText = null) => {
      const payload = nextText
        ? { text: nextText, contentIndex: null, punctIndex: null, numberIndex: null }
        : createPayload(true);

      applyText(payload);
      setInput('');
      inputValueRef.current = '';
      resetTracker();
      setArmed(isReady);
      setStarted(false);
      setFinished(false);
      setElapsedSeconds(0);
      setResults(null);
      startTimeRef.current = null;
      finishingRef.current = false;
    },
    [applyText, createPayload, isReady]
  );

  const changeContent = useCallback(() => {
    if (lessonMode || started || finished) return;

    const payload = createPayload(true);
    applyText(payload);
    setInput('');
    inputValueRef.current = '';
    resetTracker();
    setArmed(isReady);
  }, [applyText, createPayload, finished, isReady, lessonMode, started]);

  const startTest = useCallback(() => {
    if (started || finished) return;
    setArmed(true);
  }, [finished, started]);

  const focusTypingInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    warmSoundPack(soundPackId);
  }, [soundPackId]);

  useEffect(() => {
    if (!armed || finished) return undefined;

    focusTypingInput();
    const timer = window.setTimeout(focusTypingInput, 0);
    const raf = window.requestAnimationFrame(focusTypingInput);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(raf);
    };
  }, [
    armed,
    finished,
    text,
    mode.type,
    mode.duration,
    mode.count,
    mode.punctuation,
    mode.numbers,
    mode.capitals,
    mode.language,
    focusTypingInput,
  ]);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
      setContentIndex(null);
    } else if (!waitForCustomText) {
      punctIndexRef.current = null;
      numberIndexRef.current = null;
      applyText(createPayload(false));
    }

    setInput('');
    inputValueRef.current = '';
    resetTracker();
    setArmed(isReady);
    setStarted(false);
    setFinished(false);
    setElapsedSeconds(0);
    setResults(null);
    startTimeRef.current = null;
    finishingRef.current = false;
  }, [
    mode.type,
    mode.duration,
    mode.count,
    mode.punctuation,
    mode.numbers,
    mode.capitals,
    mode.language,
    mode.personalized,
    initialText,
    lessonMode,
    autoStart,
    waitForCustomText,
    applyText,
    createPayload,
  ]);

  useEffect(() => {
    if (!started || finished) return undefined;

    const interval = setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
      sampleWpm(keystrokeTrackerRef.current, elapsed, inputValueRef.current, text);

      if ((mode.type === 'time' || mode.type === 'code') && elapsed >= mode.duration) {
        finishTest(inputValueRef.current, mode.duration);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [started, finished, mode, finishTest]);

  const handleInput = (value) => {
    if (finished || !armed) return;

    if (value.length > text.length) return;

    const previousInput = inputValueRef.current;

    if (value.length < previousInput.length) {
      playKeystrokeSound(soundPackId, { isBackspace: true });
    } else if (value.length > previousInput.length) {
      keystrokeTrackerRef.current = trackKeystrokeChange(
        keystrokeTrackerRef.current,
        previousInput,
        value,
        text
      );

      const newIndex = value.length - 1;
      const expectedChar = text[newIndex] ?? '';
      const typedChar = value[newIndex];
      playKeystrokeSound(soundPackId, {
        isError: typedChar !== expectedChar,
        char: typedChar,
      });
    }

    if (!started && value.length > 0) {
      setStarted(true);
      startTimeRef.current = Date.now();
    }

    setInput(value);
    inputValueRef.current = value;

    if ((mode.type !== 'time' && mode.type !== 'code') && value.length === text.length) {
      const elapsed = startTimeRef.current
        ? Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000))
        : 1;
      finishTest(value, elapsed);
    }
  };

  const liveStats = useMemo(() => {
    const tracker = keystrokeTrackerRef.current;
    const correctCharacters = countCorrectCharacters(input, text);
    const elapsed = Math.max(elapsedSeconds, 1);
    const displayMistakes = started
      ? tracker.errorKeystrokes
      : calculateMistakes(input, text);

    return {
      wpm: started ? calculateWpm(correctCharacters, elapsed) : 0,
      accuracy: started
        ? calculateLiveAccuracy(tracker.totalKeystrokes, tracker.errorKeystrokes)
        : input.length
          ? calculateLiveAccuracy(tracker.totalKeystrokes, tracker.errorKeystrokes)
          : 100,
      mistakes: displayMistakes,
      charactersTyped: input.length,
      elapsedSeconds,
    };
  }, [input, text, started, elapsedSeconds, finished]);

  return {
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
    startTest,
    changeContent,
    lessonMode,
  };
};

export default useTypingTest;
