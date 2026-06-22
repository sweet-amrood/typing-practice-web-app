import { useState } from 'react';
import { updateCosmetics } from '../services/shopService';
import { playKeystrokeSound, warmSoundPack } from '../utils/keyboardSounds';
import '../styles/typing-trails.css';

const SelectChip = ({ active, disabled, onClick, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`rounded-lg border px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? 'border-theme-accent bg-theme-accent/15 text-theme-accent'
        : 'border-theme-border text-theme-muted hover:border-theme-accent/40'
    }`}
  >
    {children}
  </button>
);

const TrailPreview = ({ style }) => {
  if (style === 'normal') {
    return <span className="trail-preview text-emerald-400">abc</span>;
  }

  return (
    <span className="trail-preview">
      {['a', 'b', 'c'].map((char) => (
        <span key={char} className={`trail-preview__char trail-preview__char--${style}`}>
          {char}
        </span>
      ))}
    </span>
  );
};

const TypingEffectsPicker = ({ cosmetics, onUpdate }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!cosmetics) return null;

  const handleEquip = async (payload) => {
    setSaving(true);
    setError(null);

    try {
      await updateCosmetics(payload);
      await onUpdate?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const previewSound = (packId) => {
    void warmSoundPack(packId);
    playKeystrokeSound(packId, { isError: false });
  };

  return (
    <div className="rounded-lg border border-theme-border bg-theme-card/50 p-5">
      <h2 className="text-sm font-medium text-white">Typing effects</h2>
      <p className="mt-1 text-xs text-theme-muted">
        Equip sound packs and typing trails purchased from the Shop. Effects apply during practice, lessons, and races.
      </p>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-theme-muted">Sound packs</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {cosmetics.soundPacks
            ?.filter((pack) => pack.owned)
            .map((pack) => (
              <div key={pack.id} className="inline-flex items-center gap-1">
                <SelectChip
                  active={pack.equipped}
                  disabled={saving}
                  onClick={() => handleEquip({ soundPackId: pack.id })}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="sound-preview" aria-hidden="true">
                      {pack.id === 'sound-none' ? '🔇' : '🔊'}
                    </span>
                    {pack.label}
                  </span>
                </SelectChip>
                {pack.id !== 'sound-none' && (
                  <button
                    type="button"
                    className="rounded-md border border-theme-border px-2 py-1 text-[10px] uppercase tracking-wide text-theme-accent hover:bg-theme-hover"
                    disabled={saving}
                    onClick={() => previewSound(pack.id)}
                  >
                    Preview
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-theme-muted">Typing trails</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {cosmetics.trails
            ?.filter((trail) => trail.owned)
            .map((trail) => (
              <SelectChip
                key={trail.id}
                active={trail.equipped}
                disabled={saving}
                onClick={() => handleEquip({ trailId: trail.id })}
              >
                <span className="inline-flex flex-col items-start gap-1">
                  <TrailPreview style={trail.style ?? 'normal'} />
                  <span>{trail.label}</span>
                </span>
              </SelectChip>
            ))}
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default TypingEffectsPicker;
