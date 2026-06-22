import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import FloatingKeys from '../typing/FloatingKeys';

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let frameId;
    let columns = [];
    let fontSize = 14;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontSize = Math.max(12, Math.floor(window.innerWidth / 90));
      const columnCount = Math.floor(window.innerWidth / fontSize);
      columns = Array.from({ length: columnCount }, () => Math.random() * -80);
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

      columns.forEach((y, index) => {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = index * fontSize;
        const headBright = Math.random() > 0.985;

        ctx.fillStyle = headBright ? '#ccffcc' : '#00ff41';
        ctx.globalAlpha = headBright ? 0.9 : 0.35 + Math.random() * 0.35;
        ctx.fillText(char, x, y * fontSize);
        ctx.globalAlpha = 1;

        if (y * fontSize > window.innerHeight && Math.random() > 0.975) {
          columns[index] = 0;
        } else {
          columns[index] = y + 1;
        }
      });

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-40"
      aria-hidden="true"
    />
  );
};

const CyberpunkDecor = () => (
  <>
    <div className="theme-scanlines absolute inset-0 opacity-[0.18]" />
    <div
      className="absolute inset-0 opacity-30"
      style={{
        background:
          'repeating-linear-gradient(90deg, transparent, transparent 80px, rgb(5 217 232 / 0.04) 80px, rgb(5 217 232 / 0.04) 81px)',
      }}
    />
  </>
);

const CyberpunkSkyline = () => (
  <svg
    className="absolute bottom-0 left-0 w-full opacity-25"
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cyber-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff2a6d" stopOpacity="0" />
        <stop offset="100%" stopColor="#ff2a6d" stopOpacity="0.35" />
      </linearGradient>
    </defs>
    <path
      fill="url(#cyber-sky)"
      d="M0,120 L0,80 L40,80 L40,55 L70,55 L70,70 L110,70 L110,40 L150,40 L150,65 L190,65 L190,30 L230,30 L230,50 L270,50 L270,20 L310,20 L310,45 L350,45 L350,60 L400,60 L400,25 L440,25 L440,55 L480,55 L480,35 L520,35 L520,15 L560,15 L560,50 L600,50 L600,70 L640,70 L640,35 L680,35 L680,55 L720,55 L720,25 L760,25 L760,45 L800,45 L800,65 L840,65 L840,30 L880,30 L880,50 L920,50 L920,20 L960,20 L960,40 L1000,40 L1000,60 L1040,60 L1040,35 L1080,35 L1080,55 L1120,55 L1120,75 L1200,75 L1200,120 Z"
    />
    <path
      fill="none"
      stroke="#05d9e8"
      strokeWidth="1"
      opacity="0.5"
      d="M0,80 L40,80 L40,55 L70,55 L70,70 L110,70 L110,40 L150,40 L150,65 L190,65 L190,30 L230,30 L230,50 L270,50 L270,20 L310,20 L310,45 L350,45 L350,60 L400,60 L400,25 L440,25 L440,55 L480,55 L480,35 L520,35 L520,15 L560,15 L560,50 L600,50 L600,70 L640,70 L640,35 L680,35 L680,55 L720,55 L720,25 L760,25 L760,45 L800,45 L800,65 L840,65 L840,30 L880,30 L880,50 L920,50 L920,20 L960,20 L960,40 L1000,40 L1000,60 L1040,60 L1040,35 L1080,35 L1080,55 L1120,55 L1120,75 L1200,75"
    />
    <rect x="195" y="34" width="8" height="4" fill="#05d9e8" opacity="0.8" className="cyber-neon-line" />
    <rect x="515" y="19" width="6" height="3" fill="#ff2a6d" opacity="0.9" className="cyber-neon-line" />
    <rect x="845" y="34" width="8" height="4" fill="#05d9e8" opacity="0.8" className="cyber-neon-line" />
  </svg>
);

const CyberpunkCorners = () => (
  <>
    {[
      'top-4 left-4 border-t-2 border-l-2',
      'top-4 right-4 border-t-2 border-r-2',
      'bottom-4 left-4 border-b-2 border-l-2',
      'bottom-4 right-4 border-b-2 border-r-2',
    ].map((position) => (
      <div
        key={position}
        className={`absolute h-10 w-10 border-[#05d9e8] opacity-50 ${position}`}
        aria-hidden="true"
      />
    ))}
    {[
      'top-6 left-6 border-t border-l',
      'top-6 right-6 border-t border-r',
      'bottom-6 left-6 border-b border-l',
      'bottom-6 right-6 border-b border-r',
    ].map((position) => (
      <div
        key={position}
        className={`absolute h-6 w-6 border-[#ff2a6d] opacity-40 ${position}`}
        aria-hidden="true"
      />
    ))}
  </>
);

const RetroDecor = () => (
  <>
    <div className="theme-crt-scanlines retro-crt-overlay absolute inset-0 opacity-60" />
    <div className="theme-vignette absolute inset-0 opacity-70" />
    <div
      className="absolute inset-4 rounded-sm border border-[#33ff33]/10 opacity-40"
      style={{ boxShadow: 'inset 0 0 80px rgb(51 255 51 / 0.06)' }}
      aria-hidden="true"
    />
    <div className="absolute bottom-8 left-8 font-mono text-2xl text-[#33ff33]/20" aria-hidden="true">
      &gt;_
      <span className="typing-caret" />
    </div>
    <div className="absolute right-8 top-1/3 font-mono text-xs uppercase tracking-[0.4em] text-[#33ff33]/15" aria-hidden="true">
      SYS://TERM_v2.4
    </div>
  </>
);

const OceanWaves = () => (
  <div className="absolute bottom-0 left-0 w-[200%] opacity-30">
    <svg
      className="ocean-wave-layer w-1/2"
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        fill="rgb(45 212 191 / 0.15)"
        d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,80 L0,80 Z"
      />
      <path
        fill="none"
        stroke="rgb(45 212 191 / 0.35)"
        strokeWidth="1.5"
        d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40"
      />
    </svg>
    <svg
      className="ocean-wave-layer absolute bottom-0 left-0 w-1/2"
      style={{ animationDuration: '24s', animationDirection: 'reverse' }}
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        fill="rgb(10 77 104 / 0.25)"
        d="M0,30 C200,60 400,10 600,30 C800,50 1000,15 1200,30 L1200,60 L0,60 Z"
      />
    </svg>
  </div>
);

const BUBBLES = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: `${6 + (index * 7) % 88}%`,
  size: 4 + (index % 5) * 3,
  delay: `${index * 0.9}s`,
  duration: `${10 + (index % 4) * 3}s`,
}));

const OceanBubbles = () => (
  <>
    {BUBBLES.map((bubble) => (
      <span
        key={bubble.id}
        className="ocean-bubble absolute bottom-0 rounded-full border border-[#2dd4bf]/30 bg-[#2dd4bf]/10"
        style={{
          left: bubble.left,
          width: bubble.size,
          height: bubble.size,
          '--bubble-delay': bubble.delay,
          '--bubble-duration': bubble.duration,
        }}
        aria-hidden="true"
      />
    ))}
  </>
);

const SPARKLES = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  top: `${(index * 17) % 95}%`,
  left: `${(index * 23 + 11) % 95}%`,
  delay: `${(index % 6) * 0.7}s`,
  duration: `${2 + (index % 5) * 0.8}s`,
  size: 2 + (index % 3),
}));

const PurpleNeonDecor = () => (
  <>
    <div className="neon-orb absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[#a855f7]/20 blur-3xl" />
    <div
      className="neon-orb absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-[#6366f1]/20 blur-3xl"
      style={{ animationDelay: '1.5s' }}
    />
    {SPARKLES.map((sparkle) => (
      <span
        key={sparkle.id}
        className="neon-sparkle absolute rounded-full bg-[#c084fc]"
        style={{
          top: sparkle.top,
          left: sparkle.left,
          width: sparkle.size,
          height: sparkle.size,
          boxShadow: '0 0 8px #a855f7, 0 0 14px #6366f1',
          '--sparkle-delay': sparkle.delay,
          '--sparkle-duration': sparkle.duration,
        }}
        aria-hidden="true"
      />
    ))}
    <div
      className="absolute left-1/2 top-16 h-px w-48 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c084fc] to-transparent opacity-40"
      aria-hidden="true"
    />
  </>
);

const STARS = Array.from({ length: 40 }, (_, index) => ({
  id: index,
  top: `${(index * 13) % 100}%`,
  left: `${(index * 19 + 7) % 100}%`,
  delay: `${(index % 8) * 0.5}s`,
  duration: `${3 + (index % 4)}s`,
  size: index % 5 === 0 ? 2 : 1,
}));

const DarkDecor = () => (
  <>
    {STARS.map((star) => (
      <span
        key={star.id}
        className="dark-star absolute rounded-full bg-white"
        style={{
          top: star.top,
          left: star.left,
          width: star.size,
          height: star.size,
          '--star-delay': star.delay,
          '--star-duration': star.duration,
        }}
        aria-hidden="true"
      />
    ))}
    <FloatingKeys className="opacity-25" />
  </>
);

const ThemeDecorations = () => {
  const { activeTheme } = useTheme();
  const theme = activeTheme || 'dark';
  const showDotGrid = ['dark', 'ocean', 'purple-neon'].includes(theme);
  const showAccentGlow = theme !== 'matrix';

  return (
    <div className="theme-decorations pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {showDotGrid && <div className="typing-dot-grid absolute inset-0 opacity-30" />}
      {showAccentGlow && (
        <>
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-theme-accent/8 blur-3xl pulse-glow" />
          <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-theme-accent/6 blur-3xl pulse-glow" />
        </>
      )}

      {theme === 'dark' && <DarkDecor />}
      {theme === 'cyberpunk' && (
        <>
          <CyberpunkDecor />
          <CyberpunkSkyline />
          <CyberpunkCorners />
          <div className="cyber-glitch-bar absolute top-1/3 h-px w-1/3 bg-gradient-to-r from-transparent via-[#ff2a6d] to-transparent opacity-40" />
        </>
      )}
      {theme === 'matrix' && <MatrixRain />}
      {theme === 'retro' && <RetroDecor />}
      {theme === 'ocean' && (
        <>
          <OceanWaves />
          <OceanBubbles />
        </>
      )}
      {theme === 'purple-neon' && <PurpleNeonDecor />}
    </div>
  );
};

export default ThemeDecorations;
