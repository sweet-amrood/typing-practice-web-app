import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  calculateLiveAccuracy,
  calculateWpm,
  countCorrectCharacters,
  createKeystrokeTracker,
  getCurrentWordIndex,
  getWordRanges,
  trackKeystrokeChange,
} from '../utils/typingStats';
import { playKeystrokeSound, warmSoundPack } from '../utils/keyboardSounds';

const useRaceTyping = ({
  text,
  enabled,
  onProgress,
  onFinish,
  soundPackId = 'sound-none',
}) => {
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finishResults, setFinishResults] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const inputRef = useRef(null);
  const inputValueRef = useRef('');
  const startTimeRef = useRef(null);
  const finishingRef = useRef(false);
  const trackerRef = useRef(createKeystrokeTracker());
  const lastEmitRef = useRef(0);

  const wordRanges = useMemo(() => (text ? getWordRanges(text) : []), [text]);
  const currentWordIndex = getCurrentWordIndex(input.length, wordRanges);

  const reset = useCallback(() => {
    setInput('');
    inputValueRef.current = '';
    setStarted(false);
    setFinished(false);
    setFinishResults(null);
    setElapsedSeconds(0);
    startTimeRef.current = null;
    finishingRef.current = false;
    trackerRef.current = createKeystrokeTracker();
    lastEmitRef.current = 0;
  }, []);

  useEffect(() => {
    reset();
  }, [text, enabled, reset]);

  useEffect(() => {
    warmSoundPack(soundPackId);
  }, [soundPackId]);

  useEffect(() => {
    if (!enabled || finished) return undefined;

    const interval = setInterval(() => {
      if (!startTimeRef.current) return;
      setElapsedSeconds(
        Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [enabled, finished]);

  useEffect(() => {
    if (!enabled || finished) return undefined;

    const focusInput = () => inputRef.current?.focus({ preventScroll: true });
    focusInput();
    const timer = window.setTimeout(focusInput, 0);

    return () => window.clearTimeout(timer);
  }, [enabled, finished, text]);

  const emitProgress = useCallback(
    (value, elapsed) => {
      if (!text || !onProgress) return;

      const now = Date.now();
      if (now - lastEmitRef.current < 120 && value.length < text.length) {
        return;
      }

      lastEmitRef.current = now;
      const correctCharacters = countCorrectCharacters(value, text);
      const tracker = trackerRef.current;
      const wpm = calculateWpm(correctCharacters, Math.max(1, elapsed));
      const accuracy = calculateLiveAccuracy(
        tracker.totalKeystrokes,
        tracker.errorKeystrokes
      );
      const progress = Math.round((value.length / text.length) * 100);

      onProgress({ progress, wpm, accuracy });
    },
    [onProgress, text]
  );

  const finish = useCallback(
    (value, elapsed) => {
      if (finishingRef.current || !text) return;
      finishingRef.current = true;

      const duration = Math.max(1, elapsed);
      const tracker = trackerRef.current;
      const correctCharacters = countCorrectCharacters(value, text);
      const wpm = calculateWpm(correctCharacters, duration);
      const accuracy = calculateLiveAccuracy(
        tracker.totalKeystrokes,
        tracker.errorKeystrokes
      );

      const payload = {
        wpm,
        accuracy,
        duration,
        mistakes: tracker.errorKeystrokes,
        charactersTyped: value.length,
      };

      setFinished(true);
      setFinishResults(payload);
      onFinish?.(payload);
      onProgress?.({ progress: 100, wpm, accuracy });
    },
    [onFinish, onProgress, text]
  );

  const handleInput = useCallback(
    (value) => {
      if (!enabled || finished || !text) return;
      if (value.length > text.length) return;

      const previousInput = inputValueRef.current;

      if (value.length < previousInput.length) {
        playKeystrokeSound(soundPackId, { isBackspace: true });
      } else if (value.length > previousInput.length) {
        trackerRef.current = trackKeystrokeChange(
          trackerRef.current,
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

      const elapsed = startTimeRef.current
        ? Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000))
        : 1;

      emitProgress(value, elapsed);

      if (value.length === text.length) {
        finish(value, elapsed);
      }
    },
    [enabled, emitProgress, finish, finished, soundPackId, started, text]
  );

  const liveStats = useMemo(() => {
    const tracker = trackerRef.current;
    const correctCharacters = countCorrectCharacters(input, text ?? '');
    const elapsed = Math.max(elapsedSeconds, 1);

    return {
      wpm: started ? calculateWpm(correctCharacters, elapsed) : 0,
      accuracy: calculateLiveAccuracy(
        tracker.totalKeystrokes,
        tracker.errorKeystrokes
      ),
      elapsedSeconds,
    };
  }, [elapsedSeconds, input, started, text, finished]);

  return {
    input,
    started,
    finished,
    liveStats,
    wordRanges,
    currentWordIndex,
    inputRef,
    handleInput,
    finishResults,
  };
};

export default useRaceTyping;
