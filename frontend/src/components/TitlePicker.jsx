import { useState } from 'react';
import { updateTitle } from '../services/titleService';

const TitlePicker = ({ titles = [], activeTitle, onTitleChange }) => {
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState(null);
  const [showLocked, setShowLocked] = useState(false);

  const unlockedTitles = titles.filter((title) => title.unlocked);
  const visibleTitles = showLocked ? titles : unlockedTitles;

  const handleSelect = async (title) => {
    if (!title.unlocked || title.id === activeTitle || saving) return;

    setSaving(title.id);
    setError(null);

    try {
      const data = await updateTitle(title.id);
      onTitleChange?.(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="rounded-lg border border-theme-border bg-theme-card/50 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-white">Titles</h2>
          <p className="mt-1 text-xs text-theme-muted">
            Unlock titles through practice and equip one to display on your profile.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-theme-muted">
            {unlockedTitles.length} of {titles.length} unlocked
          </p>
          <button
            type="button"
            onClick={() => setShowLocked((value) => !value)}
            className="rounded-md border border-theme-border-strong px-3 py-1.5 text-xs text-theme-text-secondary hover:bg-theme-hover"
          >
            {showLocked ? 'Hide locked' : 'Show locked'}
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {visibleTitles.length === 0 ? (
        <p className="mt-4 text-sm text-theme-muted">
          No titles unlocked yet. Complete tests and missions to earn titles.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {visibleTitles.map((title) => {
            const isActive = activeTitle === title.id;
            const isSaving = saving === title.id;

            return (
              <button
                key={title.id}
                type="button"
                disabled={!title.unlocked || isSaving}
                onClick={() => handleSelect(title)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  isActive
                    ? 'border-theme-accent bg-theme-accent/20'
                    : 'border-theme-border hover:border-theme-accent/50'
                } ${!title.unlocked ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                <p className="text-sm font-medium text-white">{title.name}</p>
                <p className="mt-0.5 text-xs text-theme-muted">{title.description}</p>
                <p className={`mt-2 text-xs ${title.unlocked ? 'text-emerald-400' : 'text-theme-muted'}`}>
                  {title.unlocked ? 'Unlocked' : `Locked — ${title.unlockHint}`}
                </p>
                {isActive && (
                  <span className="mt-2 inline-block rounded-full bg-theme-accent px-2 py-0.5 text-[10px] font-medium text-white">
                    Equipped
                  </span>
                )}
                {isSaving && <p className="mt-1 text-xs text-theme-accent">Saving...</p>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TitlePicker;
