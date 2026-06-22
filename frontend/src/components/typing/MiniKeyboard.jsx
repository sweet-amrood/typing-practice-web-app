import { useEffect, useRef, useState } from 'react';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const MiniKeyboard = ({ className = '' }) => {
  const [activeKey, setActiveKey] = useState('F');
  const indexRef = useRef(0);
  const sequence = useRef(['F', 'J', 'D', 'K', 'S', 'L', 'A', 'Space', 'E', 'R']);

  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % sequence.current.length;
      setActiveKey(sequence.current[indexRef.current]);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`rounded-2xl border border-theme-border bg-theme-bg/60 p-4 shadow-xl backdrop-blur-sm ${className}`}
      aria-hidden="true"
    >
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-theme-muted">
        <span>Home row</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-glow" />
          Live
        </span>
      </div>
      <div className="space-y-1.5">
        {ROWS.map((row) => (
          <div key={row.join('')} className="flex justify-center gap-1">
            {row.map((key) => {
              const isActive = activeKey === key;
              return (
                <span
                  key={key}
                  className={`flex h-8 min-w-[1.75rem] items-center justify-center rounded-md border px-1 font-mono text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'key-press-animate border-theme-accent bg-theme-accent/25 text-theme-accent shadow-md shadow-theme-accent/20'
                      : 'border-theme-border bg-theme-card/80 text-theme-muted'
                  }`}
                  style={isActive ? { '--press-delay': '0s' } : undefined}
                >
                  {key}
                </span>
              );
            })}
          </div>
        ))}
        <div className="flex justify-center pt-1">
          <span
            className={`h-7 w-32 rounded-md border font-mono text-[10px] uppercase tracking-widest transition-all duration-150 ${
              activeKey === 'Space'
                ? 'key-press-animate border-theme-accent bg-theme-accent/25 text-theme-accent'
                : 'border-theme-border bg-theme-card/80 text-theme-muted'
            } flex items-center justify-center`}
          >
            space
          </span>
        </div>
      </div>
    </div>
  );
};

export default MiniKeyboard;
