import TypingCaret from './TypingCaret';

const PageTypingHeader = ({ label, title, subtitle, children }) => (
  <div className="relative overflow-hidden rounded-2xl border border-theme-border bg-gradient-to-br from-theme-accent/10 via-theme-card/80 to-theme-bg p-6 md:p-8">
    <div
      className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-theme-accent/15 blur-2xl"
      aria-hidden="true"
    />
    <p className="animate-slide-up text-xs font-medium uppercase tracking-[0.2em] text-theme-accent">
      {label}
      <TypingCaret />
    </p>
    <h1 className="animate-slide-up animate-slide-up-delay-1 mt-2 text-2xl font-bold text-white md:text-3xl">
      {title}
    </h1>
    {subtitle && (
      <p className="animate-slide-up animate-slide-up-delay-2 mt-2 max-w-2xl text-sm text-theme-muted">
        {subtitle}
      </p>
    )}
    {children && (
      <div className="animate-slide-up animate-slide-up-delay-3 mt-4">{children}</div>
    )}
  </div>
);

export default PageTypingHeader;
