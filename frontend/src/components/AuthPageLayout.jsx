import { Link } from 'react-router-dom';
import LiveStatsTicker from './typing/LiveStatsTicker';
import MiniKeyboard from './typing/MiniKeyboard';
import TypewriterHeadline from './typing/TypewriterHeadline';
import TypingCaret from './typing/TypingCaret';

const AUTH_PHRASES = ['your WPM', 'your streak', 'the leaderboard', 'every keystroke'];

const perks = [
  { icon: '⌨', text: 'Timed tests, quotes, and code mode' },
  { icon: '📈', text: 'XP, levels, streaks, and achievements' },
  { icon: '🏁', text: 'Multiplayer races and leaderboards' },
  { icon: '🎯', text: 'AI coach with personalized drills' },
];

const AuthPageLayout = ({ title, subtitle, children, alternate }) => (
  <section className="relative -mx-4 -mt-8 min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-10 md:-mx-0 md:mt-0 md:py-12">
    <div
      className="pointer-events-none absolute inset-0 opacity-60"
      aria-hidden="true"
    >
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-theme-accent/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-theme-accent/10 blur-3xl" />
    </div>

    <div className="relative mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center lg:gap-12">
      <div className="hidden lg:block">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-theme-accent">
          Typing Practice
          <TypingCaret />
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
          Level up
          <span className="block">
            <TypewriterHeadline phrases={AUTH_PHRASES} />
          </span>
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-theme-muted">
          Track WPM and accuracy, unlock lessons, compete in live races, and climb
          the leaderboards — all synced to your account.
        </p>

        <div className="mt-6">
          <LiveStatsTicker />
        </div>

        <div className="mt-8">
          <MiniKeyboard />
        </div>

        <ul className="mt-8 space-y-3">
          {perks.map((perk) => (
            <li
              key={perk.text}
              className="flex items-center gap-3 rounded-xl border border-theme-border/60 bg-theme-card/40 px-4 py-3 text-sm text-theme-text-secondary"
            >
              <span className="text-lg" aria-hidden="true">
                {perk.icon}
              </span>
              {perk.text}
            </li>
          ))}
        </ul>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { value: '90+', label: 'lesson levels' },
            { value: 'Live', label: 'multiplayer' },
            { value: 'Free', label: 'to start' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-theme-border bg-theme-card/50 px-3 py-4 text-center"
            >
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="mt-0.5 text-xs text-theme-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-md lg:max-w-none">
        <div className="overflow-hidden rounded-2xl border border-theme-border bg-theme-card/80 shadow-2xl shadow-black/20 backdrop-blur-sm">
          <div className="border-b border-theme-border bg-gradient-to-r from-theme-accent/15 via-theme-card to-theme-card px-8 py-6">
            <p className="text-xs font-medium uppercase tracking-wider text-theme-accent lg:hidden">
              Typing Practice
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">{title}</h2>
            <p className="mt-1 text-sm text-theme-muted">{subtitle}</p>
          </div>

          <div className="px-8 py-7">{children}</div>

          {alternate && (
            <div className="border-t border-theme-border bg-theme-bg/40 px-8 py-4 text-center text-sm text-theme-muted">
              {alternate.prefix}{' '}
              <Link
                to={alternate.to}
                className="font-medium text-theme-accent hover:text-theme-accent-hover"
              >
                {alternate.linkText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
);

export default AuthPageLayout;
