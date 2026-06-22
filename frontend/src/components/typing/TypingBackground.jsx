import FloatingKeys from './FloatingKeys';

const TypingBackground = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div className="typing-dot-grid absolute inset-0 opacity-40" />
    <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-theme-accent/8 blur-3xl pulse-glow" />
    <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-theme-accent/6 blur-3xl pulse-glow" />
    <FloatingKeys className="opacity-30" />
  </div>
);

export default TypingBackground;
