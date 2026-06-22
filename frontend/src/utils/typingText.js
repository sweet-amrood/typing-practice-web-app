import { pickCodeSnippet } from './codeSnippets';
const PRACTICE_LINES = [
  'the quick brown fox jumps over the lazy dog',
  'pack my box with five dozen liquor jugs',
  'how vexingly quick daft zebras jump',
  'the five boxing wizards jump quickly',
  'jackdaws love my big sphinx of quartz',
  'amazingly few discotheques provide jukeboxes',
  'quick zephyrs blow vexing daft jim',
  'waltz nymph for quick jigs vex bud',
  'glib jocks quiz nymph to vex dwarf',
  'sphinx of black quartz judge my vow',
  'few black taxis drive up major roads on quiet hazy nights',
  'six big juicy steaks sizzled in a pan as five workmen left the quarry',
  'jaded zombies acted quaintly but kept driving their oxen forward',
  'the job requires extra pluck and zeal from every young wage earner',
  'a mad boxer shot a quick gloved jab to the jaw of his dizzy opponent',
  'a good cook could cook as many cookies as a good cook who could cook cookies',
  'type each word with calm rhythm and steady even pressure on every key',
  'keep your eyes on the screen and let each finger find its home row key',
  'practice common pairs like th he in er an re on at en nd ti es or te of',
  'asdf jkl asdf jkl asdf jkl asdf jkl asdf jkl',
  'fdsa lkj fdsa lkj fdsa lkj fdsa lkj fdsa lkj',
  'aaa sss ddd fff jjj kkk lll aaa sss ddd fff jjj kkk lll',
  'the and for that with have this will your from they know want been good',
  'much some time very when come here just like long make many over such take',
  'work life only new years way may say each which their about would there could',
  'other after first well also new because any these give day most us is was',
  'as his her its our out up if do go no so my me we he be by or to of',
  'sad dad fad lad had pad mad bad cad glad clad plaid flash slash dash cash',
  'jell fell tell yell bell cell well sell spell smell shell swell dwell',
  'kick sick lick pick tick nick wick dock lock rock sock mock clock block',
  'jump pump dump bump lump stump frump trump plump slump grump',
  'ring sing wing king ding ping bring thing string spring swinging',
  'fast cast last past blast vast mast cast past task mask flask ask',
  'deep keep sleep steep creep weep sheep sweep beep jeep peep',
  'round sound found bound pound mound wound hound ground surround',
  'train brain drain grain plain stain sprain strain explain maintain',
  'light night right fight sight tight bright flight slight delight',
  'small fall call ball hall wall tall stall install recall overall',
  'break speak streak weak peak sneak cheek bleak freak creak',
  'fix the fax fix the fax fix the fax fix the fax fix the fax',
  'red lorry yellow lorry red lorry yellow lorry red lorry yellow lorry',
  'unique new york unique new york unique new york unique new york',
  'proper copper coffee pot proper copper coffee pot proper copper',
  'she sells seashells by the seashore she sells seashells by the seashore',
  'fred fed ted bread and ed led ted fed fred bread and ed led ted fed fred',
  'can you can a can as a canner can can a can can you can a can',
  'i wish to wish the wish you wish but only you can wish the wish i wish',
  'rubber baby buggy bumpers rubber baby buggy bumpers rubber baby buggy',
  'peter piper picked a peck of pickled peppers peter piper picked',
  'how much wood would a woodchuck chuck if a woodchuck could chuck wood',
  'fuzzy wuzzy was a bear fuzzy wuzzy had no hair fuzzy wuzzy wasnt fuzzy',
  'big black bugs bleed blue black blood but baby black bugs bleed blue blood',
  'toy boat toy boat toy boat toy boat toy boat toy boat toy boat',
  'crisp crust crackles crunchily crisp crust crackles crunchily crisp',
  'flash message flash message flash message flash message flash message',
  'align right align left align center align right align left align center',
  'index middle ring pinky index middle ring pinky index middle ring pinky',
  'space bar space bar space bar space bar space bar space bar space bar',
];

/** Lines with commas, quotes, dashes, etc. — used when @ punctuation is on. */
const PUNCTUATION_LINES = [
  'Wait—did you hear that? "Yes," she said; "I\'m ready!"',
  'Hello, world: typing, practice, and patience—what more could we need?',
  'Dr. Smith asked, "Can you finish by 3:00 p.m.?" I nodded.',
  'It\'s fun; it\'s fast; it\'s focused—keep your eyes on the screen!',
  'She whispered, "Don\'t stop now," and smiled.',
  'Waltz, nymph, for quick jigs vex; "Judge my vow!" he cried.',
  'Mix well: 2 eggs, 1/2 cup milk, and a pinch of salt—stir gently.',
  'Who\'s there? "It\'s me," said Tom; "I\'m late—again!"',
  'Stop! Look, listen, and learn: type; don\'t hunt; don\'t peek.',
  '"Pack my box," he said, "with five dozen liquor jugs—and hurry!"',
  'Mr. and Mrs. Jones—both avid typists—practiced daily at 6:30 a.m.',
  'Errors? No problem: backspace, breathe, and begin again—slowly.',
  'Keys: home row (asdf jkl;), top row (qwer uiop), bottom row (zxcv nm,.).',
  'Quote: "The quick brown fox;" unquote: jumps over the lazy dog.',
  'Three rules: (1) posture, (2) rhythm, (3) accuracy—always in that order.',
  'Hi! How are you? I\'m fine; thanks for asking—let\'s type.',
  'Email: user@mail.com; Phone: (555) 123-4567; Fax: 555-9876.',
  'Chapter 1: "Basics;" Chapter 2: "Speed;" Chapter 3: "Accuracy."',
  'Dash—em dash—hyphen-minus; colon: semicolon; period. Question?',
  'She said, "Type \'hello world\' twice;" then, "add punctuation!"',
];

export const QUOTE_LINES = [
  '"The only way to do great work is to love what you do." — Steve Jobs',
  '"It always seems impossible until it is done." — Nelson Mandela',
  '"Success is not final, failure is not fatal." — Winston Churchill',
  '"The future belongs to those who believe in the beauty of their dreams." — Eleanor Roosevelt',
  '"In the middle of every difficulty lies opportunity." — Albert Einstein',
  '"What you get by achieving your goals is not as important as what you become." — Zig Ziglar',
  '"Do not watch the clock; do what it does. Keep going." — Sam Levenson',
  '"Quality is not an act, it is a habit." — Aristotle',
  '"The secret of getting ahead is getting started." — Mark Twain',
  '"Believe you can and you are halfway there." — Theodore Roosevelt',
  '"Whether you think you can or you think you can\'t, you\'re right." — Henry Ford',
  '"The best way to predict the future is to create it." — Peter Drucker',
  '"Strive not to be a success, but rather to be of value." — Albert Einstein',
  '"I have not failed. I\'ve just found 10,000 ways that won\'t work." — Thomas Edison',
  '"It does not matter how slowly you go as long as you do not stop." — Confucius',
  '"Everything you\'ve ever wanted is on the other side of fear." — George Addair',
  '"The only limit to our realization of tomorrow is our doubts of today." — FDR',
  '"You miss 100% of the shots you don\'t take." — Wayne Gretzky',
  '"The way to get started is to quit talking and begin doing." — Walt Disney',
  '"Don\'t let yesterday take up too much of today." — Will Rogers',
  '"We may encounter many defeats but we must not be defeated." — Maya Angelou',
  '"Knowing is not enough; we must apply. Willing is not enough; we must do." — Goethe',
  '"The mind is everything. What you think you become." — Buddha',
  '"An unexamined life is not worth living." — Socrates',
  '"Life is what happens when you\'re busy making other plans." — John Lennon',
  '"Spread love everywhere you go. Let no one ever come without leaving happier." — Mother Teresa',
  '"Tell me and I forget. Teach me and I remember. Involve me and I learn." — Benjamin Franklin',
  '"The only thing we have to fear is fear itself." — Franklin D. Roosevelt',
  '"Act as if what you do makes a difference. It does." — William James',
  '"Practice makes permanent; perfect practice makes perfect." — Unknown',
];

export const NUMBER_LINES = [
  'The meeting starts at 9:30 AM on March 15, 2026, in Room 204.',
  'She saved $1,250.75 after working 40 hours at $31.25 per hour.',
  'Call 555-0142 before 6:00 PM if your order number is 884921.',
  'The recipe needs 2 cups of flour, 3 eggs, and 1/2 teaspoon of salt.',
  'Temperature dropped from 72°F to 58°F between 8 PM and midnight.',
  'Flight BA427 departs Gate 12 at 14:35 and lands at 17:50 local time.',
  'Population grew from 1.2 million in 2010 to 1.8 million in 2024.',
  'The laptop costs $899.99 with a 15% discount applied at checkout.',
  'Chapter 7 covers pages 142 through 168 of the textbook.',
  'Invest $500 monthly at 6.5% interest for 10 years to reach your goal.',
  'Order 24 boxes of 12 pens each for a total of 288 items at $3.49 each.',
  'The race was won in 9.58 seconds with a reaction time of 0.142 seconds.',
  'Room 305 is on the 3rd floor; take elevator B to level 3.',
  'Version 2.4.1 was released on 01/15/2026 with 127 bug fixes.',
  'Speed test: 85 WPM at 97.5% accuracy over 60 seconds on 03/21/2026.',
  'PIN: 4829; backup code: 7103-5521-8890; expires in 30 days.',
  'Dimensions: 1920 x 1080 pixels at 60 Hz refresh rate.',
  'Score: 1st place with 1,024 points; 2nd had 987; 3rd had 956.',
  'Distance: 5.2 km in 28 minutes; average pace 5:23 per km.',
  'Budget: $12,500 for Q1, $18,750 for Q2, and $22,000 for Q3.',
];

const PUNCT_PATTERN = /[,"'!?;:\-—]/;
const DIGIT_PATTERN = /\d/;

const pickRandom = (items, excludeIndex = null) => {
  if (items.length <= 1) return { text: items[0], index: 0 };

  let index = Math.floor(Math.random() * items.length);

  while (excludeIndex !== null && index === excludeIndex) {
    index = Math.floor(Math.random() * items.length);
  }

  return { text: items[index], index };
};

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const stripPunctuation = (text) =>
  text
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

const splitWords = (text) => text.split(/\s+/).filter(Boolean);

const capitalizeSentences = (text) => {
  const lower = text.toLowerCase();
  const capitalized = lower.replace(
    /(?:^|[.!?]\s+)([a-z])/g,
    (match, letter) => match.slice(0, -1) + letter.toUpperCase()
  );

  return capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
};

const applyCapitals = (text, capitals) => {
  if (!capitals) {
    return text.toLowerCase();
  }

  if (text === text.toLowerCase()) {
    return capitalizeSentences(text);
  }

  return text;
};

/** Apply punctuation strip + capitalization for time/words modes. */
const finalizeText = (text, mode) => {
  let result = text;

  if (!mode.punctuation) {
    result = stripPunctuation(result);
  }

  return applyCapitals(result, mode.capitals !== false);
};

const lineForMode = (line, mode) =>
  mode.punctuation ? line : stripPunctuation(line);

const joinLines = (lines, count = 2) => shuffle(lines).slice(0, count).join(' ');

const collectPracticeWords = (targetCount) => {
  const words = [];
  const pool = shuffle(PRACTICE_LINES);

  for (const line of pool) {
    for (const word of shuffle(splitWords(line))) {
      words.push(word);
      if (words.length >= targetCount) {
        return words;
      }
    }
  }

  const fallback = shuffle(pool.flatMap((line) => splitWords(line)));

  while (words.length < targetCount) {
    words.push(fallback[words.length % fallback.length]);
  }

  return words;
};

const emptyIndices = () => ({
  punctIndex: null,
  numberIndex: null,
});

const pickModifierSegments = (mode, excludes = {}) => {
  const segments = [];
  const indices = emptyIndices();

  if (mode.punctuation) {
    const pick = pickRandom(PUNCTUATION_LINES, excludes.punctIndex ?? null);
    segments.push(lineForMode(pick.text, mode));
    indices.punctIndex = pick.index;
  }

  if (mode.numbers) {
    const pick = pickRandom(NUMBER_LINES, excludes.numberIndex ?? null);
    segments.push(lineForMode(pick.text, mode));
    indices.numberIndex = pick.index;
  }

  return { segments, indices };
};

const buildTimedText = (mode, excludes = {}) => {
  const { segments, indices } = pickModifierSegments(mode, excludes);
  const parts = [joinLines(PRACTICE_LINES, 2), ...segments, joinLines(PRACTICE_LINES, 1)];

  return {
    text: finalizeText(parts.join(' '), mode),
    ...indices,
  };
};

const buildWordText = (mode, excludes = {}) => {
  const targetCount = mode.count ?? 25;
  const { segments, indices } = pickModifierSegments(mode, excludes);
  const modifierWords = segments.flatMap((segment) => splitWords(segment));
  const words = [...modifierWords, ...collectPracticeWords(targetCount)];

  return {
    text: finalizeText(words.join(' '), mode),
    ...indices,
  };
};

const buildQuoteText = (mode, excludes = {}) => {
  const result = pickRandom(QUOTE_LINES, excludes.contentIndex ?? null);
  const { segments, indices } = pickModifierSegments(mode, excludes);
  const parts = [result.text, ...segments];

  return {
    text: applyCapitals(parts.join(' '), mode.capitals !== false),
    contentIndex: result.index,
    ...indices,
  };
};

const normalizeOptions = (legacyContentIndex, options = {}) => {
  if (typeof legacyContentIndex === 'object' && legacyContentIndex !== null) {
    return legacyContentIndex;
  }

  return {
    contentIndex: legacyContentIndex ?? null,
    ...options,
  };
};

const attachIndices = (payload) => ({
  text: payload.text,
  contentIndex: payload.contentIndex ?? null,
  punctIndex: payload.punctIndex ?? null,
  numberIndex: payload.numberIndex ?? null,
});

export const textMatchesMode = (text, mode) => {
  if (mode.punctuation && !PUNCT_PATTERN.test(text)) {
    return false;
  }

  if (mode.numbers && !DIGIT_PATTERN.test(text)) {
    return false;
  }

  if (!mode.punctuation && PUNCT_PATTERN.test(text)) {
    return false;
  }

  return true;
};

export const generateTextForMode = (mode, legacyContentIndex = null, options = {}) => {
  const excludes = normalizeOptions(legacyContentIndex, options);

  switch (mode.type) {
    case 'time':
      return attachIndices(buildTimedText(mode, excludes));
    case 'words':
      return attachIndices(buildWordText(mode, excludes));
    case 'quote':
      return attachIndices(buildQuoteText(mode, excludes));
    case 'code':
      return attachIndices({
        ...pickCodeSnippet(mode.language ?? 'javascript', excludes.contentIndex ?? null),
      });
    default:
      return attachIndices(buildTimedText(mode, excludes));
  }
};

export const canRefreshContent = (mode) =>
  ['time', 'words', 'quote', 'code'].includes(mode.type);
