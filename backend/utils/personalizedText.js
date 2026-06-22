const INTEREST_PHRASES = {
  gaming: [
    'Every quest rewards patience and quick reflexes on the keyboard.',
    'Level up your typing speed like unlocking a new skill tree.',
    'Pixel perfect accuracy matters when every combo counts.',
  ],
  music: [
    'Rhythm and flow make typing feel like playing a steady melody.',
    'Each chord of practice builds muscle memory for faster tempo.',
    'Harmony between speed and accuracy creates confident lyrics on screen.',
  ],
  sports: [
    'Athletes train daily; typists build endurance one sprint at a time.',
    'Champions focus on form before they chase a personal record.',
    'Teamwork in esports starts with reliable communication under pressure.',
  ],
  science: [
    'Curiosity drives experiments and careful observation of every result.',
    'Hypothesis testing teaches us to measure progress with real data.',
    'Laboratory notes demand precision, clarity, and consistent technique.',
  ],
  travel: [
    'Exploring new cities teaches adaptability and sharp navigation skills.',
    'Passport stamps remind us that practice opens doors worldwide.',
    'Local markets, mountain trails, and coastal roads inspire vivid stories.',
  ],
  cooking: [
    'Great recipes balance timing, preparation, and confident execution.',
    'Fresh ingredients and sharp knives reward calm, deliberate movement.',
    'A simmering sauce teaches patience while flavors slowly combine.',
  ],
  books: [
    'Readers become writers when they type stories with vivid detail.',
    'Libraries hold chapters of wisdom waiting for curious minds.',
    'A compelling narrative needs rhythm, pacing, and clean punctuation.',
  ],
  technology: [
    'Innovation moves fast, but fundamentals still anchor every build.',
    'Debugging teaches humility and attention to small details.',
    'Clean interfaces depend on thoughtful design and precise execution.',
  ],
  art: [
    'Creative work blends imagination with disciplined daily practice.',
    'Color, contrast, and composition guide the eye across the canvas.',
    'Sketching ideas quickly helps artists refine their vision later.',
  ],
  movies: [
    'Screenwriters craft dialogue that sounds natural when typed aloud.',
    'Every scene needs pacing, tension, and a clear emotional arc.',
    'Behind great films are teams that communicate with sharp focus.',
  ],
};

const CAREER_PHRASES = {
  'software-developer': [
    'Clean code reads like prose and saves hours during future refactors.',
    'Version control, testing, and documentation protect every release.',
    'Developers ship features by balancing speed with maintainability.',
  ],
  'data-analyst': [
    'Analysts transform raw numbers into decisions leaders can trust.',
    'Spreadsheets, dashboards, and SQL queries reveal hidden patterns.',
    'Accurate data entry prevents costly mistakes downstream.',
  ],
  writer: [
    'Writers draft quickly, then revise until every sentence sings.',
    'Deadlines reward typists who can sustain focus for hours.',
    'Strong vocabulary and flow keep readers engaged page after page.',
  ],
  journalist: [
    'Reporters type fast under pressure while facts stay verified.',
    'Headlines must be crisp, clear, and impossible to misread.',
    'Interview notes become stories when accuracy meets speed.',
  ],
  medical: [
    'Clinical notes require precision because small errors carry risk.',
    'Healthcare teams document symptoms, plans, and follow ups clearly.',
    'Patient charts demand legible records and consistent terminology.',
  ],
  legal: [
    'Legal documents rely on exact language and careful punctuation.',
    'Briefs and contracts reward typists who notice every clause.',
    'Paralegals organize evidence with methodical attention to detail.',
  ],
  student: [
    'Students juggle lectures, essays, and research across busy semesters.',
    'Strong typing skills free mental energy for deeper learning.',
    'Study notes become useful when they are fast, neat, and searchable.',
  ],
  designer: [
    'Designers communicate ideas through typography, layout, and motion.',
    'Client feedback loops move faster when documentation stays clear.',
    'Creative portfolios showcase craft, consistency, and attention to detail.',
  ],
  freelancer: [
    'Freelancers manage clients, invoices, and deadlines from one desk.',
    'Reliable delivery builds reputation faster than clever marketing alone.',
    'Remote work rewards self discipline and responsive communication.',
  ],
};

const WEAK_KEY_WORDS = {
  q: ['quick', 'quest', 'quiet', 'queue', 'quilt', 'quartz'],
  w: ['water', 'window', 'wonder', 'wealth', 'wrist', 'woven'],
  e: ['every', 'energy', 'elegant', 'ember', 'elite', 'essay'],
  r: ['river', 'rapid', 'render', 'rhythm', 'royal', 'rustic'],
  t: ['table', 'trust', 'tiger', 'topic', 'trend', 'treat'],
  y: ['young', 'yield', 'yellow', 'yearly', 'yonder', 'yacht'],
  u: ['useful', 'unity', 'urban', 'urgent', 'upload', 'ultra'],
  i: ['input', 'ideal', 'ivory', 'inbox', 'index', 'irony'],
  o: ['ocean', 'orbit', 'olive', 'offer', 'often', 'opera'],
  p: ['pixel', 'piano', 'pilot', 'plant', 'proud', 'pulse'],
  a: ['alpha', 'amber', 'anchor', 'apple', 'arrow', 'atlas'],
  s: ['swift', 'solar', 'solid', 'story', 'scale', 'spark'],
  d: ['draft', 'delta', 'dense', 'dream', 'drive', 'dusty'],
  f: ['focus', 'fiber', 'flame', 'fresh', 'front', 'frost'],
  g: ['giant', 'glass', 'globe', 'grace', 'grain', 'green'],
  h: ['happy', 'heart', 'honor', 'horse', 'house', 'hurry'],
  j: ['jolly', 'judge', 'juice', 'jungle', 'joint', 'jewel'],
  k: ['karma', 'kayak', 'kneel', 'knife', 'knock', 'known'],
  l: ['light', 'logic', 'lucky', 'lunar', 'layer', 'leafy'],
  z: ['zebra', 'zesty', 'zinc', 'zone', 'zoom', 'fuzzy'],
  x: ['extra', 'pixel', 'oxide', 'toxic', 'relax', 'index'],
  c: ['clean', 'cloud', 'craft', 'cycle', 'civic', 'crisp'],
  v: ['vivid', 'voice', 'vital', 'vapor', 'venue', 'vowel'],
  b: ['brave', 'brick', 'bloom', 'boost', 'brain', 'broad'],
  n: ['noble', 'north', 'nerve', 'ninth', 'novel', 'nurse'],
  m: ['magic', 'metal', 'model', 'music', 'march', 'mellow'],
  ' ': ['space bar rhythm keeps sentences flowing naturally'],
};

const DIFFICULTY_CONFIG = {
  beginner: {
    targetWords: 38,
    maxWordLength: 6,
    punctuation: false,
    capitals: false,
    drillRepeats: 1,
  },
  intermediate: {
    targetWords: 52,
    maxWordLength: 10,
    punctuation: true,
    capitals: true,
    drillRepeats: 2,
  },
  advanced: {
    targetWords: 65,
    maxWordLength: 14,
    punctuation: true,
    capitals: true,
    drillRepeats: 3,
  },
};

export const INTEREST_OPTIONS = Object.keys(INTEREST_PHRASES);
export const CAREER_OPTIONS = Object.keys(CAREER_PHRASES);
export const DIFFICULTY_OPTIONS = ['beginner', 'intermediate', 'advanced'];

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

const shuffle = (items) => {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }

  return copy;
};

const normalizeLetter = (key) => {
  if (!key || key === 'space') return ' ';
  return String(key).toLowerCase().charAt(0);
};

const wordsFromPhrase = (phrase) =>
  phrase
    .replace(/[^a-zA-Z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const filterByDifficulty = (words, maxWordLength) =>
  words.filter((word) => word.length <= maxWordLength);

const buildWeakKeyDrill = (weakKeys, config) => {
  const letters = weakKeys
    .map((item) => normalizeLetter(item.key ?? item.label ?? item))
    .filter((letter) => letter && letter !== ' ')
    .slice(0, 4);

  if (!letters.length) {
    return [];
  }

  const drillWords = letters.flatMap((letter) => {
    const pool = WEAK_KEY_WORDS[letter] ?? [`${letter}${letter}${letter}ing`];
    return shuffle(pool).slice(0, config.drillRepeats);
  });

  const pairs = letters.map((letter) => {
    const word = pickRandom(WEAK_KEY_WORDS[letter] ?? ['practice']);
    return `${word} ${letter}${letter}${letter}`;
  });

  return [...drillWords, ...pairs];
};

const collectTopicPhrases = (interests, careerGoal) => {
  const phrases = [];

  for (const interest of interests) {
    const pool = INTEREST_PHRASES[interest];
    if (pool) phrases.push(pickRandom(pool));
  }

  const careerPool = CAREER_PHRASES[careerGoal];
  if (careerPool) {
    phrases.push(pickRandom(careerPool));
    phrases.push(pickRandom(careerPool));
  }

  if (!phrases.length) {
    phrases.push(
      'Personalized practice blends your goals, interests, and typing habits into one focused session.'
    );
  }

  return phrases;
};

const applyCapitalization = (text, capitals) => {
  if (capitals) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return text.toLowerCase();
};

const buildPassage = (topicPhrases, weakDrillWords, config, targetWords) => {
  const phraseSegments = topicPhrases.map((phrase) => {
    const words = filterByDifficulty(wordsFromPhrase(phrase), config.maxWordLength);
    return words.join(' ');
  });

  const drillSegment = weakDrillWords.join(' ');
  const chunks = shuffle([
    ...phraseSegments,
    drillSegment,
    ...phraseSegments,
  ]).filter(Boolean);

  let passage = chunks.join(' ');
  let words = passage.split(/\s+/).filter(Boolean);

  if (words.length > targetWords) {
    passage = words.slice(0, targetWords).join(' ');
    words = words.slice(0, targetWords);
  }

  while (words.length < Math.min(20, targetWords) && phraseSegments.length) {
    passage = `${passage} ${pickRandom(phraseSegments)}`.trim();
    words = passage.split(/\s+/).filter(Boolean);
  }

  if (words.length > targetWords) {
    passage = words.slice(0, targetWords).join(' ');
  }

  return passage;
};

export const generatePersonalizedText = ({
  interests = [],
  careerGoal = null,
  difficulty = 'intermediate',
  weakKeys = [],
  wordCount = null,
} = {}) => {
  const config = DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG.intermediate;
  const targetWords = wordCount ?? config.targetWords;
  const normalizedInterests = interests.filter((item) => INTEREST_OPTIONS.includes(item));
  const normalizedCareer = CAREER_OPTIONS.includes(careerGoal) ? careerGoal : null;

  const topicPhrases = collectTopicPhrases(normalizedInterests, normalizedCareer);
  const weakDrillWords = buildWeakKeyDrill(weakKeys, config).flatMap((segment) =>
    filterByDifficulty(wordsFromPhrase(segment), config.maxWordLength)
  );

  let text = buildPassage(topicPhrases, weakDrillWords, config, targetWords);

  if (config.punctuation && text) {
    text = `${text}.`;
  }

  text = applyCapitalization(text, config.capitals);

  const finalWordCount = text.split(/\s+/).filter(Boolean).length;

  return {
    text,
    meta: {
      interests: normalizedInterests,
      careerGoal: normalizedCareer,
      difficulty,
      focusKeys: weakKeys.slice(0, 4).map((item) => item.label ?? item.key ?? item),
      wordCount: finalWordCount,
    },
  };
};
