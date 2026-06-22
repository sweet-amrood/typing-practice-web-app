export const INTEREST_OPTIONS = [
  { id: 'gaming', label: 'Gaming' },
  { id: 'music', label: 'Music' },
  { id: 'sports', label: 'Sports' },
  { id: 'science', label: 'Science' },
  { id: 'travel', label: 'Travel' },
  { id: 'cooking', label: 'Cooking' },
  { id: 'books', label: 'Books' },
  { id: 'technology', label: 'Technology' },
  { id: 'art', label: 'Art' },
  { id: 'movies', label: 'Movies' },
];

export const CAREER_OPTIONS = [
  { id: 'software-developer', label: 'Software developer' },
  { id: 'data-analyst', label: 'Data analyst' },
  { id: 'writer', label: 'Writer' },
  { id: 'journalist', label: 'Journalist' },
  { id: 'medical', label: 'Medical / healthcare' },
  { id: 'legal', label: 'Legal' },
  { id: 'student', label: 'Student' },
  { id: 'designer', label: 'Designer' },
  { id: 'freelancer', label: 'Freelancer' },
];

export const DIFFICULTY_OPTIONS = [
  { id: 'beginner', label: 'Beginner', hint: 'Short words, simple sentences' },
  { id: 'intermediate', label: 'Intermediate', hint: 'Mixed vocabulary with punctuation' },
  { id: 'advanced', label: 'Advanced', hint: 'Longer words and richer passages' },
];

export const DEFAULT_TYPING_PREFERENCES = {
  interests: [],
  careerGoal: null,
  difficulty: 'intermediate',
};

export const getInterestLabel = (id) =>
  INTEREST_OPTIONS.find((item) => item.id === id)?.label ?? id;

export const getCareerLabel = (id) =>
  CAREER_OPTIONS.find((item) => item.id === id)?.label ?? id;
