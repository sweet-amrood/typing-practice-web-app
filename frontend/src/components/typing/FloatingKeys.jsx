const KEYS = [
  { label: 'A', style: { top: '12%', left: '8%', '--key-rotate': '-8deg', '--float-delay': '0s' } },
  { label: 'S', style: { top: '28%', left: '72%', '--key-rotate': '6deg', '--float-delay': '0.8s' } },
  { label: 'D', style: { top: '55%', left: '15%', '--key-rotate': '-4deg', '--float-delay': '1.4s' } },
  { label: 'F', style: { top: '68%', left: '58%', '--key-rotate': '10deg', '--float-delay': '0.3s' } },
  { label: 'J', style: { top: '18%', left: '42%', '--key-rotate': '3deg', '--float-delay': '1.9s' } },
  { label: 'K', style: { top: '78%', left: '82%', '--key-rotate': '-6deg', '--float-delay': '1.1s' } },
  { label: '⌨', style: { top: '40%', left: '88%', '--key-rotate': '0deg', '--float-delay': '2.2s' } },
];

const KeyCap = ({ label, style }) => (
  <div
    className="float-key absolute flex h-11 w-11 items-center justify-center rounded-lg border border-theme-border-strong bg-theme-card/80 font-mono text-sm font-semibold text-theme-text-secondary shadow-lg backdrop-blur-sm"
    style={style}
    aria-hidden="true"
  >
    {label}
  </div>
);

const FloatingKeys = ({ className = '' }) => (
  <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
    {KEYS.map((key) => (
      <KeyCap key={key.label + key.style.left} label={key.label} style={key.style} />
    ))}
  </div>
);

export default FloatingKeys;
