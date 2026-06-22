const RACE_LINES = [
  'the quick brown fox jumps over the lazy dog',
  'pack my box with five dozen liquor jugs',
  'how vexingly quick daft zebras jump',
  'the five boxing wizards jump quickly',
  'jackdaws love my big sphinx of quartz',
  'amazingly few discotheques provide jukeboxes',
  'waltz bad nymph for quick jigs vex',
  'sphinx of black quartz judge my vow',
  'two driven jocks help fax my big quiz',
  'the job requires extra pluck and zeal from every young wage earner',
];

export const generateRaceText = (wordCount = 25) => {
  const words = [];

  while (words.length < wordCount) {
    const line = RACE_LINES[Math.floor(Math.random() * RACE_LINES.length)];
    words.push(...line.split(/\s+/).filter(Boolean));
  }

  return words.slice(0, wordCount).join(' ');
};

export const RACE_WORD_COUNT = 25;
export const RACE_COUNTDOWN_MS = 3000;
