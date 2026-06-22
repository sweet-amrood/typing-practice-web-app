import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LiveStatsTicker from '../components/typing/LiveStatsTicker';
import MiniKeyboard from '../components/typing/MiniKeyboard';
import TypewriterHeadline from '../components/typing/TypewriterHeadline';
import TypingCaret from '../components/typing/TypingCaret';

const TYPEWRITER_PHRASES = [
  'speed and accuracy',
  'muscle memory',
  'daily streaks',
  'live races',
  'code snippets',
  'leaderboard glory',
];

const features = [
  {
    icon: '⏱',
    title: 'Timed practice',
    description:
      'Run 15s, 30s, or 60s tests and track your live WPM, accuracy, and mistakes.',
  },
  {
    icon: '📚',
    title: 'Structured lessons',
    description:
      'Three difficulty modes with 30 levels each. Level 1 is open in every mode.',
  },
  {
    icon: '📊',
    title: 'Progress dashboard',
    description:
      'Charts for daily and weekly activity, test history, streaks, XP, and coins.',
  },
  {
    icon: '🏆',
    title: 'Achievements',
    description:
      'Earn badges for milestones like speed goals, streaks, and words typed.',
  },
  {
    icon: '🏁',
    title: 'Multiplayer races',
    description: 'Compete in real-time typing races with live progress bars.',
  },
  {
    icon: '🤖',
    title: 'AI coach',
    description: 'Personalized drills based on your weak keys and finger patterns.',
  },
];

const steps = [
  'Create a free account and open Practice or Lessons.',
  'Start typing — the timer begins on your first keystroke.',
  'Earn at least 2 stars on a lesson to unlock the next level.',
  'Check the dashboard to review trends and keep your streak alive.',
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl border border-theme-border bg-gradient-to-br from-theme-accent/15 via-theme-card/90 to-theme-bg p-8 md:p-10">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-theme-accent/20 blur-3xl pulse-glow"
          aria-hidden="true"
        />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="animate-slide-up text-sm font-medium uppercase tracking-[0.2em] text-theme-accent">
              Typing Practice
              <TypingCaret />
            </p>
            <h1 className="animate-slide-up animate-slide-up-delay-1 mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              Master{' '}
              <TypewriterHeadline phrases={TYPEWRITER_PHRASES} />
            </h1>
            <p className="animate-slide-up animate-slide-up-delay-2 mt-5 max-w-xl text-base leading-relaxed text-theme-muted">
              Practice freely with timed tests, quotes, and code mode — or follow guided
              lessons across beginner, intermediate, and advanced paths.
            </p>

            <div className="animate-slide-up animate-slide-up-delay-3 mt-6">
              <LiveStatsTicker />
            </div>

            <div className="animate-slide-up animate-slide-up-delay-3 mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/test"
                    className="inline-flex rounded-xl bg-theme-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/25 transition-transform hover:scale-[1.02] hover:bg-theme-accent-hover"
                  >
                    Start Practice
                  </Link>
                  <Link
                    to="/race"
                    className="inline-flex rounded-xl border border-theme-border-strong px-5 py-2.5 text-sm font-medium text-theme-text-secondary transition-colors hover:bg-theme-hover"
                  >
                    Join a Race
                  </Link>
                  <Link
                    to="/lessons"
                    className="inline-flex rounded-xl border border-theme-border-strong px-5 py-2.5 text-sm font-medium text-theme-text-secondary transition-colors hover:bg-theme-hover"
                  >
                    Lessons
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex rounded-xl bg-theme-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/25 transition-transform hover:scale-[1.02] hover:bg-theme-accent-hover"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex rounded-xl border border-theme-border-strong px-5 py-2.5 text-sm font-medium text-theme-text-secondary transition-colors hover:bg-theme-hover"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="animate-slide-up animate-slide-up-delay-2 hidden lg:block">
            <MiniKeyboard />
            <p className="mt-4 text-center font-mono text-xs text-theme-muted">
              the quick brown fox jumps over the lazy dog
              <TypingCaret />
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <article
            key={feature.title}
            className={`hover-lift rounded-xl border border-theme-border bg-theme-card/60 p-6 animate-slide-up`}
            style={{ animationDelay: `${0.05 * index}s` }}
          >
            <span className="text-2xl" aria-hidden="true">
              {feature.icon}
            </span>
            <h2 className="mt-3 text-lg font-semibold text-white">{feature.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-theme-muted">
              {feature.description}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="hover-lift rounded-xl border border-theme-border bg-theme-card/60 p-6">
          <h2 className="text-lg font-semibold text-white">How it works</h2>
          <ol className="mt-4 space-y-3 text-sm text-theme-muted">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-theme-accent/20 font-mono text-xs font-semibold text-theme-accent">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="hover-lift rounded-xl border border-theme-border bg-gradient-to-br from-theme-card to-theme-bg p-6">
          <h2 className="text-lg font-semibold text-white">Lesson unlock rules</h2>
          <ul className="mt-4 space-y-3 text-sm text-theme-muted">
            <li>Level 1 is unlocked in Beginner, Intermediate, and Advanced.</li>
            <li>Earn 2 stars to pass a level; 3 stars is a perfect run.</li>
            <li>Beginner pass: 30 WPM and 75% accuracy. Higher modes need more.</li>
            <li>Practice mode includes timed tests, quotes, code, and modifiers.</li>
          </ul>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {['Beginner', 'Intermediate', 'Advanced'].map((label) => (
              <div
                key={label}
                className="rounded-lg border border-theme-border bg-theme-bg/50 px-3 py-4 text-center"
              >
                <p className="text-xs uppercase tracking-wider text-theme-muted">{label}</p>
                <p className="mt-1 font-mono text-2xl font-bold text-theme-accent">30</p>
                <p className="text-xs text-theme-muted">levels</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="relative overflow-hidden rounded-xl border border-theme-accent/30 bg-theme-accent/10 p-8 text-center">
          <div
            className="pointer-events-none absolute inset-0 font-mono text-[10px] leading-relaxed text-theme-accent/10"
            aria-hidden="true"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <p key={i} className="truncate px-4">
                asdf jkl; the quick brown fox pack my box with five dozen liquor jugs
              </p>
            ))}
          </div>
          <p className="relative text-sm text-theme-accent">
            Sign up to save your stats, unlock lesson levels, and earn streak rewards.
          </p>
          <Link
            to="/signup"
            className="relative mt-4 inline-flex rounded-xl bg-theme-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/20 hover:bg-theme-accent-hover"
          >
            Create free account
          </Link>
        </div>
      )}
    </section>
  );
};

export default Home;
