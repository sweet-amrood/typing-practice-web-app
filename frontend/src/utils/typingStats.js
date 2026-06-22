import { getFingerForChar } from './keyFingerMap';

export const countCorrectCharacters = (input, text) => {
  let correct = 0;

  for (let i = 0; i < input.length; i += 1) {
    if (input[i] === text[i]) {
      correct += 1;
    }
  }

  return correct;
};

/** Position-based mismatches in the final input (legacy / display). */
export const calculateMistakes = (input, text) => {
  let mistakes = 0;

  for (let i = 0; i < input.length; i += 1) {
    if (input[i] !== text[i]) {
      mistakes += 1;
    }
  }

  return mistakes;
};

export const calculateWpm = (correctCharacters, elapsedSeconds) => {
  if (elapsedSeconds <= 0) return 0;
  return Math.round((correctCharacters / 5) * (60 / elapsedSeconds));
};

/** Live accuracy: correct keystrokes / total keystrokes during the session. */
export const calculateLiveAccuracy = (totalKeystrokes, errorKeystrokes) => {
  if (totalKeystrokes === 0) return 100;
  const correct = totalKeystrokes - errorKeystrokes;
  return Math.round((correct / totalKeystrokes) * 100);
};

export const calculateAccuracy = (input, text) => {
  if (input.length === 0) return 100;
  const correct = countCorrectCharacters(input, text);
  return Math.round((correct / input.length) * 100);
};

export const createKeystrokeTracker = () => ({
  totalKeystrokes: 0,
  errorKeystrokes: 0,
  keyErrors: {},
  keyAttempts: {},
  fingerErrors: {},
  fingerAttempts: {},
  wpmSamples: [],
  lastSampleSecond: 0,
});

const incrementMap = (map, key, amount = 1) => {
  map[key] = (map[key] ?? 0) + amount;
};

export const trackKeystrokeChange = (tracker, previousInput, nextInput, text) => {
  if (nextInput.length <= previousInput.length) {
    return tracker;
  }

  const added = nextInput.slice(previousInput.length);

  for (let i = 0; i < added.length; i += 1) {
    const index = previousInput.length + i;
    const expectedChar = text[index] ?? '';
    const typedChar = added[i];
    const key = expectedChar || typedChar;
    const finger = getFingerForChar(key);

    tracker.totalKeystrokes += 1;
    incrementMap(tracker.keyAttempts, key);
    incrementMap(tracker.fingerAttempts, finger);

    if (typedChar !== expectedChar) {
      tracker.errorKeystrokes += 1;
      incrementMap(tracker.keyErrors, key);
      incrementMap(tracker.fingerErrors, finger);
    }
  }

  return tracker;
};

export const sampleWpm = (tracker, elapsedSeconds, input, text) => {
  if (elapsedSeconds < 3 || elapsedSeconds === tracker.lastSampleSecond) {
    return tracker;
  }

  if (elapsedSeconds - tracker.lastSampleSecond < 3) {
    return tracker;
  }

  const correctCharacters = countCorrectCharacters(input, text);
  const wpm = calculateWpm(correctCharacters, elapsedSeconds);

  tracker.wpmSamples.push({ atSeconds: elapsedSeconds, wpm });
  tracker.lastSampleSecond = elapsedSeconds;

  return tracker;
};

export const countSpeedDrops = (samples, threshold = 15) => {
  let drops = 0;

  for (let i = 1; i < samples.length; i += 1) {
    const prev = samples[i - 1].wpm;
    const curr = samples[i].wpm;

    if (prev - curr >= threshold) {
      drops += 1;
    }
  }

  return drops;
};

export const exportTypingAnalytics = (tracker, { mode = 'practice', isCoachExercise = false } = {}) => ({
  keyErrors: { ...tracker.keyErrors },
  keyAttempts: { ...tracker.keyAttempts },
  fingerErrors: { ...tracker.fingerErrors },
  fingerAttempts: { ...tracker.fingerAttempts },
  speedDrops: countSpeedDrops(tracker.wpmSamples),
  mode,
  isCoachExercise,
});

export const getWordRanges = (text) => {
  const words = text.split(' ');
  const ranges = [];
  let index = 0;

  words.forEach((word, wordIndex) => {
    ranges.push({
      word,
      start: index,
      end: index + word.length,
      wordIndex,
    });
    index += word.length + 1;
  });

  return ranges;
};

export const getCurrentWordIndex = (cursor, ranges) => {
  const match = ranges.find(
    (range) => cursor >= range.start && cursor <= range.end
  );

  if (match) return match.wordIndex;

  if (cursor > ranges[ranges.length - 1]?.end) {
    return ranges.length - 1;
  }

  return 0;
};
