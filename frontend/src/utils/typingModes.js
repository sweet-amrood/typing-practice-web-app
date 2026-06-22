export const TIME_PRESETS = [15, 30, 60, 120];

export const WORD_COUNTS = [10, 25, 50, 100];

export const CODE_LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'sql', label: 'SQL' },
  { id: 'java', label: 'Java' },
  { id: 'react', label: 'React' },
];

export const MAIN_MODES = [
  { id: 'time', label: 'time' },
  { id: 'words', label: 'words' },
  { id: 'quote', label: 'quote' },
  { id: 'code', label: 'code' },
];

export const DEFAULT_MODE = {
  type: 'time',
  duration: 30,
  count: 25,
  punctuation: false,
  numbers: false,
  capitals: true,
  personalized: false,
};

export const buildMode = ({
  type = 'time',
  duration = 30,
  count = 25,
  punctuation = false,
  numbers = false,
  capitals = true,
  language = 'javascript',
  personalized = false,
} = {}) => ({
  type,
  duration,
  count,
  punctuation,
  numbers,
  capitals,
  language,
  personalized,
});

export const getModeDescription = (mode) => {
  const extras = [
    mode.punctuation && 'punctuation',
    mode.numbers && 'numbers',
    mode.capitals === false && 'lowercase',
  ]
    .filter(Boolean)
    .join(' + ');

  let base = '';

  if (mode.type === 'time') {
    base = `Type as much as you can in ${mode.duration} seconds`;
  } else if (mode.type === 'words') {
    base = `Type ${mode.count} words`;
    if (mode.punctuation || mode.numbers) {
      base += ' plus modifier passages';
    }
    if (mode.capitals === false) {
      base += ' (lowercase)';
    }
  } else if (mode.type === 'quote') {
    base = 'Type a famous quote';
    if (mode.numbers) {
      base += ' with numbers';
    }
  } else if (mode.type === 'code') {
    const lang =
      CODE_LANGUAGES.find((item) => item.id === mode.language)?.label ??
      mode.language;
    base = `Type ${lang} code with syntax highlighting`;
  } else {
    base = 'Type the passage';
  }

  if (mode.personalized) {
    base = `Personalized practice — ${base.toLowerCase()}`;
  }

  return extras ? `${base} (${extras})` : base;
};

export const getTimerDisplay = (mode, elapsedSeconds, started) => {
  if (!started) {
    if (mode.type === 'time') return `${mode.duration}s`;
    return '0s';
  }

  if (mode.type === 'time') {
    return `${Math.max(0, mode.duration - elapsedSeconds)}s`;
  }

  if (mode.type === 'code') {
    return `${Math.max(0, mode.duration - elapsedSeconds)}s`;
  }

  return `${elapsedSeconds}s`;
};

export const modesEqual = (a, b) =>
  a.type === b.type &&
  a.duration === b.duration &&
  a.count === b.count &&
  a.punctuation === b.punctuation &&
  a.numbers === b.numbers &&
  a.capitals === b.capitals &&
  Boolean(a.personalized) === Boolean(b.personalized) &&
  (a.language ?? 'javascript') === (b.language ?? 'javascript');
