import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { updateTheme } from '../services/progressService';
import { applyTheme, THEMES as THEME_META } from '../utils/themes';

const THEME_PREVIEW_DECOR = {
  dark: (
    <div className="absolute inset-0">
      <span className="absolute left-2 top-2 h-0.5 w-0.5 rounded-full bg-white/60" />
      <span className="absolute right-4 top-5 h-0.5 w-0.5 rounded-full bg-white/40" />
      <span className="absolute bottom-3 left-6 h-0.5 w-0.5 rounded-full bg-white/50" />
    </div>
  ),
  cyberpunk: (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-40" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgb(0 0 0 / 0.3) 3px, rgb(0 0 0 / 0.3) 5px)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-[#ff2a6d]/50 to-transparent" />
      <div className="absolute left-1 top-1 h-2 w-2 border-l border-t border-[#05d9e8]/80" />
      <div className="absolute bottom-1 right-1 h-2 w-2 border-b border-r border-[#ff2a6d]/80" />
    </div>
  ),
  matrix: (
    <div className="absolute inset-0 font-mono text-[6px] leading-none text-[#00ff41]/50">
      {['ア', '0', '1', 'イ', 'ウ'].map((char, index) => (
        <span
          key={char}
          className="absolute"
          style={{ left: `${12 + index * 18}%`, top: `${8 + index * 14}%` }}
        >
          {char}
        </span>
      ))}
    </div>
  ),
  retro: (
    <div className="absolute inset-0">
      <div className="absolute inset-0 opacity-50" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgb(0 0 0 / 0.25) 2px, rgb(0 0 0 / 0.25) 4px)' }} />
      <span className="absolute bottom-1 left-2 font-mono text-[8px] text-[#33ff33]/70">&gt;_</span>
    </div>
  ),
  ocean: (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#2dd4bf]/25" style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
      <span className="absolute bottom-3 left-4 h-1 w-1 rounded-full border border-[#2dd4bf]/50" />
      <span className="absolute bottom-5 right-5 h-1.5 w-1.5 rounded-full border border-[#2dd4bf]/40" />
    </div>
  ),
  'purple-neon': (
    <div className="absolute inset-0">
      <span className="absolute left-3 top-2 h-1 w-1 rounded-full bg-[#c084fc] shadow-[0_0_6px_#a855f7]" />
      <span className="absolute right-4 top-4 h-0.5 w-0.5 rounded-full bg-[#c084fc] shadow-[0_0_4px_#a855f7]" />
      <div className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c084fc]/60 to-transparent" />
    </div>
  ),
};

const ThemePreview = ({ themeId, preview }) => (
  <div className="relative flex h-12 overflow-hidden rounded-md border border-white/10">
    {preview.map((color) => (
      <span key={color} className="h-full flex-1" style={{ backgroundColor: color }} />
    ))}
    {THEME_PREVIEW_DECOR[themeId]}
  </div>
);

const ThemePicker = ({ themes = [], activeTheme, onThemeChange }) => {
  const { setThemeData } = useTheme();
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState(null);
  const [showLocked, setShowLocked] = useState(false);

  const displayThemes = (themes.length ? themes : THEME_META).map((theme) => ({
    ...THEME_META.find((item) => item.id === theme.id),
    ...theme,
  }));

  const unlockedThemes = displayThemes.filter((theme) => theme.unlocked);
  const visibleThemes = showLocked ? displayThemes : unlockedThemes;

  const handleSelect = async (theme) => {
    if (!theme.unlocked || theme.id === activeTheme || saving) {
      return;
    }

    setSaving(theme.id);
    setError(null);

    try {
      const data = await updateTheme(theme.id);
      applyTheme(data.activeTheme);
      setThemeData(data);
      onThemeChange?.(data);
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
          <h2 className="text-sm font-medium text-white">Themes</h2>
          <p className="mt-1 text-xs text-theme-muted">
            Each theme changes colors, fonts, and ambient effects across the site.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-theme-muted">
            {unlockedThemes.length} of {displayThemes.length} unlocked
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

      {visibleThemes.length === 0 ? (
        <p className="mt-4 text-sm text-theme-muted">
          Only the default dark theme is available. Level up and complete achievements to unlock more.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {visibleThemes.map((theme) => {
            const isActive = activeTheme === theme.id;
            const isSaving = saving === theme.id;

            return (
              <button
                key={theme.id}
                type="button"
                disabled={!theme.unlocked || isSaving}
                onClick={() => handleSelect(theme)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  isActive
                    ? 'border-theme-accent bg-theme-accent/20'
                    : 'border-theme-border hover:border-theme-accent/50'
                } ${!theme.unlocked ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                <ThemePreview themeId={theme.id} preview={theme.preview} />
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-white">{theme.name}</p>
                    <p className="mt-0.5 text-xs text-theme-muted">{theme.description}</p>
                    {theme.personality && (
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-theme-accent/80">
                        {theme.personality}
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <span className="rounded-full bg-theme-accent px-2 py-0.5 text-[10px] font-medium text-white">
                      Active
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-xs ${theme.unlocked ? 'text-emerald-400' : 'text-theme-muted'}`}>
                  {theme.unlocked ? 'Unlocked' : `Locked — ${theme.unlockHint}`}
                </p>
                {isSaving && (
                  <p className="mt-1 text-xs text-theme-accent">Saving...</p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
