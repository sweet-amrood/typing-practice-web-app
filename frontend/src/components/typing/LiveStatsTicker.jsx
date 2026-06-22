import { useEffect, useRef, useState } from 'react';

const LiveStatsTicker = ({ className = '' }) => {
  const [wpm, setWpm] = useState(72);
  const [accuracy, setAccuracy] = useState(96);
  const [pop, setPop] = useState(false);
  const prevWpm = useRef(wpm);

  useEffect(() => {
    const interval = setInterval(() => {
      setWpm((value) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const next = Math.max(45, Math.min(120, value + delta));
        if (next !== prevWpm.current) {
          prevWpm.current = next;
          setPop(true);
          setTimeout(() => setPop(false), 350);
        }
        return next;
      });
      setAccuracy((value) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(88, Math.min(100, value + delta));
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-4 rounded-xl border border-theme-border bg-theme-bg/70 px-4 py-2.5 font-mono text-sm backdrop-blur-sm ${className}`}
      aria-hidden="true"
    >
      <div>
        <p className="text-[10px] uppercase tracking-wider text-theme-muted">WPM</p>
        <p className={`text-xl font-bold tabular-nums text-theme-accent ${pop ? 'ticker-pop' : ''}`}>
          {wpm}
        </p>
      </div>
      <div className="h-8 w-px bg-theme-border" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-theme-muted">ACC</p>
        <p className="text-xl font-bold tabular-nums text-emerald-400">{accuracy}%</p>
      </div>
      <div className="h-8 w-px bg-theme-border" />
      <div className="flex items-center gap-1.5">
        <span className="typing-caret" />
        <span className="text-xs text-theme-muted">typing…</span>
      </div>
    </div>
  );
};

export default LiveStatsTicker;
