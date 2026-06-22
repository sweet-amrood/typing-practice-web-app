import { useState } from 'react';
import {
  CAREER_OPTIONS,
  DEFAULT_TYPING_PREFERENCES,
  DIFFICULTY_OPTIONS,
  INTEREST_OPTIONS,
} from '../utils/practicePreferences';

const Chip = ({ active, disabled, onClick, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`rounded-md px-2.5 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? 'bg-theme-accent/20 text-theme-accent'
        : 'text-theme-muted hover:bg-theme-hover hover:text-white'
    }`}
  >
    {children}
  </button>
);

const TypingPreferencesForm = ({
  preferences = DEFAULT_TYPING_PREFERENCES,
  onSave,
  disabled = false,
  compact = false,
}) => {
  const [draft, setDraft] = useState({
    interests: preferences.interests ?? [],
    careerGoal: preferences.careerGoal ?? null,
    difficulty: preferences.difficulty ?? 'intermediate',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const toggleInterest = (id) => {
    setSaved(false);
    setDraft((current) => {
      const exists = current.interests.includes(id);

      if (exists) {
        return {
          ...current,
          interests: current.interests.filter((item) => item !== id),
        };
      }

      if (current.interests.length >= 3) {
        return current;
      }

      return {
        ...current,
        interests: [...current.interests, id],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await onSave(draft);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-4' : 'space-y-5'}>
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-white">Interests</p>
          <p className="text-xs text-theme-muted">Pick up to 3</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {INTEREST_OPTIONS.map((option) => (
            <Chip
              key={option.id}
              active={draft.interests.includes(option.id)}
              disabled={
                disabled ||
                (!draft.interests.includes(option.id) && draft.interests.length >= 3)
              }
              onClick={() => toggleInterest(option.id)}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-white">Career goal</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {CAREER_OPTIONS.map((option) => (
            <Chip
              key={option.id}
              active={draft.careerGoal === option.id}
              disabled={disabled}
              onClick={() => {
                setSaved(false);
                setDraft((current) => ({
                  ...current,
                  careerGoal: current.careerGoal === option.id ? null : option.id,
                }));
              }}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-white">Difficulty</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {DIFFICULTY_OPTIONS.map((option) => (
            <Chip
              key={option.id}
              active={draft.difficulty === option.id}
              disabled={disabled}
              onClick={() => {
                setSaved(false);
                setDraft((current) => ({ ...current, difficulty: option.id }));
              }}
            >
              {option.label}
            </Chip>
          ))}
        </div>
        <p className="mt-2 text-xs text-theme-muted">
          {DIFFICULTY_OPTIONS.find((item) => item.id === draft.difficulty)?.hint}
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {saved && <p className="text-sm text-emerald-400">Preferences saved.</p>}

      <button
        type="submit"
        disabled={disabled || saving}
        className="rounded-md bg-theme-accent px-4 py-2 text-sm font-medium text-white hover:bg-theme-accent-hover disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save practice preferences'}
      </button>
    </form>
  );
};

export default TypingPreferencesForm;
