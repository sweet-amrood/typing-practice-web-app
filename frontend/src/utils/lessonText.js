export const MODE_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const BEGINNER_LINES = [
  'The sun is warm today.',
  'I like to read good books.',
  'She walks to the park every morning.',
  'We eat fresh fruit for breakfast.',
  'My friend lives near the river.',
  'The dog runs fast in the yard.',
  'He plays music on a small guitar.',
  'They plant flowers in the garden.',
  'A kind nurse helps the patient.',
  'We write notes with blue ink.',
  'The baby sleeps in a soft bed.',
  'Birds sing outside my window.',
  'I drink water after a long run.',
  'Our team won the school game.',
  'The baker makes warm bread daily.',
  'She folds clean clothes with care.',
  'We learn new words every week.',
  'The train stops at the old station.',
  'He draws maps of the small town.',
  'They share food with hungry guests.',
  'I call my family on the phone.',
  'The lake looks calm at sunset.',
  'We pack bags for a short trip.',
  'Her cat sleeps on the red chair.',
  'The teacher reads a funny story.',
  'I brush my teeth before school.',
  'We watch clouds move across the sky.',
  'The mail arrives before noon.',
  'He fixes bikes for his neighbors.',
  'They dance to a happy song.',
];

const INTERMEDIATE_LINES = [
  'Learning to type with accuracy builds confidence that helps you finish school essays and work reports much faster.',
  'When you practice every day, your fingers remember common letter patterns and your speed improves without extra effort.',
  'Good posture, relaxed shoulders, and steady breathing make long typing sessions comfortable and reduce unnecessary mistakes.',
  'Reading the next phrase before you finish the current one keeps your rhythm smooth and prevents awkward pauses mid sentence.',
  'Typing tests reward both precision and pace, so focus on clean input first and let your words per minute grow naturally.',
  'Muscle memory develops through repetition, which means short focused sessions are often better than one rushed marathon.',
  'Common English words appear constantly in messages, articles, and emails, so mastering them pays off in real daily writing.',
  'Punctuation marks like commas, periods, and question marks appear in normal sentences and deserve careful practice too.',
  'Expanding your vocabulary with descriptive adjectives and precise verbs makes your writing clearer and more interesting.',
  'Intermediate lessons use longer natural sentences with varied word lengths to gently increase the challenge over time.',
  'Consistent hand placement on the home row anchors your technique while your fingers reach confidently for distant keys.',
  'Errors are useful feedback because they show which letter combinations still need attention during your next practice block.',
  'Many professional writers draft quickly on keyboards, then revise slowly, which separates speed from thoughtful editing.',
  'Digital communication depends on fast accurate typing, whether you are chatting, coding, taking notes, or publishing online.',
  'Challenge yourself with unfamiliar words so your brain stays engaged instead of autopiloting through the same patterns.',
  'Balance is important because chasing speed alone often creates careless mistakes that slow you down overall.',
  'Listening to calm music while typing can help some people maintain focus, though silence works better for others.',
  'Break long paragraphs into mental chunks so each phrase feels manageable instead of overwhelming your working memory.',
  'Your accuracy percentage reflects careful keystrokes, and even small improvements compound into impressive long term results.',
  'Intermediate practice should feel slightly demanding yet still readable, like normal language rather than random drills.',
  'Office workers, students, journalists, and developers all benefit from comfortable typing skills built through patient repetition.',
  'Try to keep your eyes on the screen rather than the keyboard so you catch mistakes immediately as they happen.',
  'Warm up with easy sentences before attempting difficult passages, similar to stretching before a physical workout.',
  'Natural language includes articles, prepositions, conjunctions, and varied syllable counts that mirror real world writing.',
  'Celebrate steady progress instead of comparing yourself to experts who have logged thousands of hours of practice.',
  'Typing fluently frees your mind to think about ideas instead of hunting for individual letters on the keyboard.',
  'Intermediate lines gradually introduce longer clauses, richer vocabulary, and smoother transitions between related thoughts.',
  'Practice sessions become more effective when you review results and deliberately repeat weak letter combinations afterward.',
  'Clear thinking supports clear typing because you know what you intend to write before your fingers begin moving.',
  'Stay patient with yourself because meaningful skill growth usually arrives in small steps rather than sudden leaps.',
];

const ADVANCED_LINES = [
  'Advanced typists combine exceptional accuracy with sustained speed, translating complex ideas into text almost as quickly as they think them.',
  'Sophisticated vocabulary—including terminology from science, literature, business, and technology—demands precise finger control and confident punctuation habits.',
  'When you encounter unfamiliar multisyllabic words, slow down briefly, type them correctly, and your muscle memory will absorb the pattern for next time.',
  'Professional environments expect polished written communication, so practicing articulate sentences prepares you for emails, documentation, and collaborative projects.',
  'Complex sentences with dependent clauses, parenthetical phrases, and semicolons mirror the structure of academic papers and technical specifications.',
  'Maintaining high accuracy under time pressure requires calm focus, disciplined technique, and trust in the keyboard layout you have trained.',
  'Advanced lessons emphasize longer flowing passages where a single mistake does not define the session, but consistency still matters greatly.',
  'Critical thinking and fast typing complement each other because capturing nuanced arguments quickly helps you refine ideas while they remain fresh.',
  'Developers frequently switch between natural language comments and symbolic code fragments, which strengthens adaptability across different character sets.',
  'Editors often rewrite verbose drafts into concise prose, a skill supported by typing quickly enough to experiment with alternative phrasings.',
  'Research shows that distributed practice across many days produces stronger retention than cramming identical drills into one exhausting evening.',
  'Ambitious learners track metrics like words per minute, error rate, and streak length to stay motivated without obsessing over daily fluctuations.',
  'Typing mastery is less about innate talent and more about deliberate practice, thoughtful feedback, and willingness to repeat challenging material.',
  'Longform writing projects become less intimidating when keyboard fluency removes the mechanical barrier between imagination and recorded language.',
  'Advanced passages may include numbers, hyphenated compounds, and quoted speech because real documents rarely limit themselves to simple patterns.',
  'Precision matters in legal, medical, and engineering contexts where a misplaced character can change meaning in costly ways.',
  'Seasoned typists glance ahead several words, planning finger movements before they arrive so the text feels like continuous motion.',
  'Even experts return to fundamentals occasionally, refreshing home row discipline and posture after periods of sloppy habit formation.',
  'Collaborative tools, version control systems, and messaging platforms all assume participants can express themselves rapidly through the keyboard.',
  'Your personal best records are worth celebrating, yet the deeper victory is building a reliable skill you can use for decades.',
  'Advanced training should feel like reading thoughtful editorial content, not memorizing disconnected tokens arranged for artificial difficulty.',
  'Multitasking while typing usually reduces quality, so dedicated practice blocks without notifications produce the strongest improvement curves.',
  'Translators, transcriptionists, and court reporters demonstrate how professional typing skills translate directly into career opportunities worldwide.',
  'When fatigue appears, short breaks restore accuracy better than pushing through diminishing returns with tense shoulders and wrists.',
  'Language is inherently creative, and fluent typing lets you capture spontaneous insights before they fade from working memory.',
  'Advanced learners often alternate between prose passages and symbol-heavy snippets to stay comfortable across diverse writing contexts.',
  'Confidence grows when difficult paragraphs no longer intimidate you because experience proves that careful practice makes them manageable.',
  'Reflect on each session by noting which words caused hesitation, then target those patterns in tomorrow’s focused repetition.',
  'True expertise feels effortless from the outside yet rests on countless hours of patient rehearsal hidden from casual observers.',
  'Finish advanced levels with pride knowing you can express complex thoughts clearly, quickly, and accurately whenever inspiration strikes.',
];

const lineCountForLevel = (level, mode) => {
  if (mode === 'beginner') {
    if (level <= 10) return 1;
    if (level <= 20) return 2;
    return 3;
  }

  if (mode === 'intermediate') {
    if (level <= 8) return 1;
    if (level <= 18) return 2;
    return 2;
  }

  if (level <= 6) return 1;
  if (level <= 18) return 2;
  return 2;
};

const pickLines = (pool, level, mode) => {
  const count = lineCountForLevel(level, mode);
  const lines = [];

  for (let index = 0; index < count; index += 1) {
    lines.push(pool[(level - 1 + index) % pool.length]);
  }

  return lines.join(' ');
};

export const generateLessonText = (mode, level) => {
  switch (mode) {
    case 'beginner':
      return pickLines(BEGINNER_LINES, level, 'beginner');
    case 'intermediate':
      return pickLines(INTERMEDIATE_LINES, level, 'intermediate');
    case 'advanced':
      return pickLines(ADVANCED_LINES, level, 'advanced');
    default:
      return pickLines(BEGINNER_LINES, level, 'beginner');
  }
};

export const getLessonWordCount = (mode, level) => {
  const text = generateLessonText(mode, level);
  return text.trim().split(/\s+/).filter(Boolean).length;
};
