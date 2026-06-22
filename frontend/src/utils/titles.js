export const TITLES = [
  { id: 'novice', name: 'Novice', description: 'Every journey starts here', unlockHint: 'Always available' },
  { id: 'speedster', name: 'Speedster', description: 'Breaking the 60 WPM barrier', unlockHint: 'Reach 60 WPM' },
  { id: 'sprinter', name: 'Sprinter', description: 'Fast fingers, faster mind', unlockHint: 'Reach 80 WPM' },
  { id: 'lightning', name: 'Lightning', description: 'Triple-digit typing speed', unlockHint: 'Reach 100 WPM' },
  { id: 'sharp-eye', name: 'Sharp Eye', description: 'Precision over speed', unlockHint: 'Reach 98% best accuracy' },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Flawless execution', unlockHint: 'Achieve 100% best accuracy' },
  { id: 'dedicated', name: 'Dedicated', description: 'Practice makes permanent', unlockHint: 'Complete 50 typing tests' },
  { id: 'veteran', name: 'Veteran', description: 'Seasoned typist', unlockHint: 'Complete 200 typing tests' },
  { id: 'streaker', name: 'Streaker', description: 'Two weeks of daily practice', unlockHint: 'Maintain a 14-day streak' },
  { id: 'scholar', name: 'Scholar', description: 'Lesson master', unlockHint: 'Complete 30 lesson levels' },
  { id: 'coder', name: 'Coder', description: 'Syntax in muscle memory', unlockHint: 'Complete 10 programming tests' },
  { id: 'coach-graduate', name: 'Coach Graduate', description: 'Trained with the AI coach', unlockHint: 'Complete 5 coach exercises' },
  { id: 'weekly-warrior', name: 'Weekly Warrior', description: 'Weekly challenge champion', unlockHint: 'Complete weekly challenge' },
  { id: 'shop-title-whale', name: 'Coin Whale', description: 'Economy flex', unlockHint: 'Shop purchase' },
  { id: 'shop-title-phantom', name: 'Phantom Keys', description: 'Faster than sight', unlockHint: 'Shop purchase' },
  { id: 'shop-title-mythic', name: 'Mythic Typist', description: 'Ultimate prestige', unlockHint: 'Shop purchase' },
];

export const getTitleById = (id) => TITLES.find((title) => title.id === id);

export const getTitleName = (id, titles = TITLES) =>
  titles.find((title) => title.id === id)?.name ?? getTitleById(id)?.name ?? 'Novice';
