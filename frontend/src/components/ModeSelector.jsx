import { useState } from 'react';
import {
  buildMode,
  CODE_LANGUAGES,
  MAIN_MODES,
  TIME_PRESETS,
  WORD_COUNTS,
} from '../utils/typingModes';

const ToggleChip = ({ icon, label, active, disabled, onClick }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? 'text-theme-accent'
        : 'text-theme-muted hover:text-theme-text-secondary'
    }`}
  >
    <span className="text-base leading-none opacity-80">{icon}</span>
    <span>{label}</span>
  </button>
);

const ModeChip = ({ icon, label, active, disabled, onClick }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? 'text-theme-accent'
        : 'text-theme-muted hover:text-theme-text-secondary'
    }`}
  >
    <span className="text-base leading-none opacity-80">{icon}</span>
    <span>{label}</span>
  </button>
);

const SubChip = ({ active, disabled, onClick, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`rounded-md px-2.5 py-1 text-sm tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? 'text-theme-accent'
        : 'text-theme-muted hover:text-theme-text-secondary'
    }`}
  >
    {children}
  </button>
);

const MODE_ICONS = {
  time: '🕐',
  words: 'A',
  quote: '❝',
  code: '{ }',
};

const ModeSelector = ({ mode, onChange, disabled }) => {
  const [customTime, setCustomTime] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const update = (patch) => onChange(buildMode({ ...mode, ...patch }));

  const selectType = (type) => {
    if (type === 'code') {
      update({
        type,
        language: mode.language ?? 'javascript',
        duration: mode.duration || 60,
        personalized: false,
      });
      return;
    }
    update({ type });
  };

  const togglePunctuation = () => {
    update({ punctuation: !mode.punctuation });
  };

  const toggleNumbers = () => {
    update({ numbers: !mode.numbers });
  };

  const applyCustomTime = () => {
    const seconds = Number(customTime);
    if (!Number.isInteger(seconds) || seconds < 5 || seconds > 600) return;
    update({ type: 'time', duration: seconds });
    setShowCustom(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-0.5 rounded-xl bg-theme-hover/60 p-1.5">
        <ToggleChip
          icon="@"
          label="punctuation"
          active={mode.punctuation}
          disabled={disabled || mode.type === 'code'}
          onClick={togglePunctuation}
        />
        <ToggleChip
          icon="#"
          label="numbers"
          active={mode.numbers}
          disabled={disabled || mode.type === 'code'}
          onClick={toggleNumbers}
        />
        <ToggleChip
          icon="Aa"
          label="caps"
          active={mode.capitals !== false}
          disabled={disabled || mode.type === 'code'}
          onClick={() => update({ capitals: true })}
        />
        <ToggleChip
          icon="aa"
          label="lower"
          active={mode.capitals === false}
          disabled={disabled || mode.type === 'code'}
          onClick={() => update({ capitals: false })}
        />

        <ToggleChip
          icon="✦"
          label="for you"
          active={Boolean(mode.personalized)}
          disabled={disabled || mode.type === 'code'}
          onClick={() => update({ personalized: !mode.personalized })}
        />

        <span className="mx-1.5 h-5 w-px bg-theme-border" aria-hidden="true" />

        {MAIN_MODES.map((item) => (
          <ModeChip
            key={item.id}
            icon={MODE_ICONS[item.id]}
            label={item.label}
            active={mode.type === item.id}
            disabled={disabled}
            onClick={() => selectType(item.id)}
          />
        ))}
      </div>

      {mode.type === 'time' && (
        <div className="flex flex-wrap items-center gap-0.5 rounded-xl bg-theme-hover/40 px-2 py-1.5">
          {TIME_PRESETS.map((seconds) => (
            <SubChip
              key={seconds}
              active={mode.duration === seconds}
              disabled={disabled}
              onClick={() => update({ duration: seconds })}
            >
              {seconds}
            </SubChip>
          ))}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowCustom((value) => !value)}
            className={`rounded-md px-2 py-1 text-sm transition-colors disabled:opacity-40 ${
              showCustom ? 'text-theme-accent' : 'text-theme-muted hover:text-theme-text-secondary'
            }`}
            title="Custom time"
          >
            🔧
          </button>
          {showCustom && (
            <div className="ml-1 flex items-center gap-1">
              <input
                type="number"
                min={5}
                max={600}
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="sec"
                disabled={disabled}
                className="w-16 rounded-md border border-theme-border-strong bg-theme-card px-2 py-1 text-sm text-white outline-none focus:border-theme-accent/50 disabled:opacity-40"
              />
              <SubChip disabled={disabled} onClick={applyCustomTime}>
                set
              </SubChip>
            </div>
          )}
        </div>
      )}

      {mode.type === 'words' && (
        <div className="flex flex-wrap items-center gap-0.5 rounded-xl bg-theme-hover/40 px-2 py-1.5">
          {WORD_COUNTS.map((count) => (
            <SubChip
              key={count}
              active={mode.count === count}
              disabled={disabled}
              onClick={() => update({ count })}
            >
              {count}
            </SubChip>
          ))}
        </div>
      )}

      {mode.type === 'code' && (
        <div className="flex flex-wrap items-center gap-0.5 rounded-xl bg-theme-hover/40 px-2 py-1.5">
          {CODE_LANGUAGES.map((lang) => (
            <SubChip
              key={lang.id}
              active={(mode.language ?? 'javascript') === lang.id}
              disabled={disabled}
              onClick={() => update({ language: lang.id })}
            >
              {lang.label}
            </SubChip>
          ))}
        </div>
      )}

      {(mode.type === 'time' || mode.type === 'code') && mode.type === 'code' && (
        <div className="flex flex-wrap items-center gap-0.5 rounded-xl bg-theme-hover/40 px-2 py-1.5">
          {TIME_PRESETS.map((seconds) => (
            <SubChip
              key={seconds}
              active={mode.duration === seconds}
              disabled={disabled}
              onClick={() => update({ duration: seconds })}
            >
              {seconds}s
            </SubChip>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModeSelector;
