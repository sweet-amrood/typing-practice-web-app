import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AchievementBadge from '../components/AchievementBadge';
import BadgePicker from '../components/BadgePicker';
import DailyRewardModal from '../components/DailyRewardModal';
import { CoinIcon } from '../components/RewardIcons';
import StreakCard from '../components/StreakCard';
import ThemePicker from '../components/ThemePicker';
import TitlePicker from '../components/TitlePicker';
import CosmeticsPicker from '../components/CosmeticsPicker';
import TypingEffectsPicker from '../components/TypingEffectsPicker';
import MissionsPanel from '../components/MissionsPanel';
import TypingPreferencesForm from '../components/TypingPreferencesForm';
import FriendsPanel from '../components/FriendsPanel';
import UserAvatar from '../components/UserAvatar';
import UserDisplayName from '../components/UserDisplayName';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useStats } from '../context/StatsContext';
import { getAchievements } from '../services/achievementService';
import { getTitleName } from '../utils/titles';
import { DEFAULT_TYPING_PREFERENCES } from '../utils/practicePreferences';

const DIFFICULTY_PREFIXES = ['beginner_', 'intermediate_', 'advanced_'];

const isDifficultyAchievement = (key) =>
  DIFFICULTY_PREFIXES.some((prefix) => key.startsWith(prefix));

const SectionHeading = ({ title, description }) => (
  <div className="border-b border-theme-border pb-2">
    <h2 className="text-base font-semibold text-white">{title}</h2>
    {description && <p className="mt-0.5 text-xs text-theme-muted">{description}</p>}
  </div>
);

const Profile = () => {
  const { user, refreshUser, updateProfile } = useAuth();
  const { progress, refreshStats } = useStats();
  const { themes, activeTheme, setThemeData } = useTheme();
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [streakModalOpen, setStreakModalOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profile, achievementData] = await Promise.all([
          refreshUser(),
          getAchievements(),
        ]);
        setUsername(profile.username);
        setEmail(profile.email);
        setAchievements(achievementData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await updateProfile({ username, email });
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onThemeChange = async (data) => {
    setThemeData(data);
    await refreshStats();
  };

  if (loading) {
    return <p className="py-20 text-center text-sm text-theme-muted">Loading...</p>;
  }

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  const generalAchievements =
    achievements?.achievements.filter((item) => !isDifficultyAchievement(item.key)) ??
    [];

  const difficultyCategories = ['beginner', 'intermediate', 'advanced'].map(
    (category) => ({
      category,
      items:
        achievements?.achievements.filter((item) =>
          item.key.startsWith(`${category}_`)
        ) ?? [],
    })
  );

  const filterVisible = (items) =>
    showAllAchievements ? items : items.filter((item) => item.unlocked);

  const visibleGeneral = filterVisible(generalAchievements);

  const quickLinks = [
    { to: '/test', label: 'Practice' },
    { to: '/lessons', label: 'Lessons' },
    { to: '/coach', label: 'Coach' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/shop', label: 'Shop' },
  ];

  return (
    <section className="mx-auto max-w-2xl space-y-8">
      {/* ── Header ── */}
      <div className="rounded-xl border border-theme-border bg-theme-card/50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <UserAvatar
              image={progress?.cosmetics?.avatarImage}
              frameStyle={
                progress?.cosmetics?.frames?.find((item) => item.equipped)?.style ?? 'slate'
              }
              size="lg"
            />
            <div>
              <UserDisplayName
                name={user?.username ?? 'Player'}
                badgeEmoji={
                  progress?.cosmetics?.badges?.find((item) => item.equipped)?.emoji
                  ?? progress?.cosmetics?.icons?.find((item) => item.equipped)?.emoji
                }
                title={
                  progress?.activeTitle
                    ? getTitleName(progress.activeTitle, progress.titles)
                    : null
                }
                nameClassName="text-2xl font-semibold text-white"
                titleClassName="text-sm text-theme-accent"
              />
              <p className="mt-1 text-xs text-theme-muted">Joined {joinDate}</p>
            </div>
          </div>
          <Link
            to="/shop"
            className="rounded-lg border border-theme-border bg-theme-bg/40 px-3 py-2 text-xs font-medium text-theme-accent hover:border-theme-accent/40"
          >
            Visit Shop
          </Link>
        </div>

        {progress && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-theme-border bg-theme-bg/40 px-3 py-2.5">
              <p className="text-xs text-theme-muted">Level</p>
              <p className="mt-0.5 text-lg font-semibold text-white">{progress.currentLevel}</p>
            </div>
            <div className="rounded-lg border border-theme-border bg-theme-bg/40 px-3 py-2.5">
              <p className="text-xs text-theme-muted">XP</p>
              <p className="mt-0.5 text-lg font-semibold text-white">
                {progress.xp.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-theme-border bg-theme-bg/40 px-3 py-2.5">
              <p className="text-xs text-theme-muted">Coins</p>
              <p className="mt-0.5 flex items-center gap-1 text-lg font-semibold text-white">
                <CoinIcon className="h-4 w-4" />
                {progress.coins}
              </p>
            </div>
            <div className="rounded-lg border border-theme-border bg-theme-bg/40 px-3 py-2.5">
              <p className="text-xs text-theme-muted">Best WPM</p>
              <p className="mt-0.5 text-lg font-semibold text-white">{progress.highestWPM}</p>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md border border-theme-border px-2.5 py-1 text-xs text-theme-text-secondary hover:border-theme-accent/40 hover:text-theme-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {progress && (
        <>
          {/* ── Customize ── */}
          <div className="space-y-4">
            <SectionHeading
              title="Customize"
              description="Avatar, badges, titles, themes, and typing effects."
            />
            <CosmeticsPicker cosmetics={progress.cosmetics} onUpdate={refreshStats} />
            <BadgePicker cosmetics={progress.cosmetics} onUpdate={refreshStats} />
            <TitlePicker
              titles={progress.titles ?? []}
              activeTitle={progress.activeTitle}
              onTitleChange={refreshStats}
            />
            <ThemePicker
              themes={themes.length ? themes : progress.themes ?? []}
              activeTheme={activeTheme || progress.activeTheme}
              onThemeChange={onThemeChange}
            />
            <TypingEffectsPicker cosmetics={progress.cosmetics} onUpdate={refreshStats} />
          </div>

          {/* ── Progress ── */}
          <div className="space-y-4">
            <SectionHeading
              title="Progress"
              description="Missions, streak rewards, and achievements."
            />
            <MissionsPanel missions={progress.missions} onUpdate={refreshStats} />
            <StreakCard
              streak={progress.streak}
              purpleNeonUnlocked={progress.unlockedThemes?.includes('purple-neon')}
              onOpenRewards={() => setStreakModalOpen(true)}
            />
            {achievements && (
              <div className="rounded-lg border border-theme-border bg-theme-card/50 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium text-white">Achievements</h3>
                    <p className="mt-0.5 text-xs text-theme-muted">
                      {achievements.unlockedCount} earned of {achievements.totalCount} total
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllAchievements((value) => !value)}
                    className="rounded-md border border-theme-border-strong px-3 py-1.5 text-xs text-theme-text-secondary hover:bg-theme-hover"
                  >
                    {showAllAchievements ? 'Show earned only' : 'Show all'}
                  </button>
                </div>

                <div className="space-y-6">
                  {visibleGeneral.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-theme-muted">
                        General
                      </h4>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {visibleGeneral.map((achievement) => (
                          <AchievementBadge key={achievement.key} achievement={achievement} />
                        ))}
                      </div>
                    </div>
                  )}

                  {difficultyCategories.map(({ category, items }) => {
                    const visibleItems = filterVisible(items);
                    if (!visibleItems.length) return null;

                    const titles = {
                      beginner: 'Beginner Mode',
                      intermediate: 'Intermediate Mode',
                      advanced: 'Advanced Mode',
                    };

                    return (
                      <div key={category}>
                        <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-theme-muted">
                          {titles[category]}
                        </h4>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {visibleItems.map((achievement) => (
                            <AchievementBadge key={achievement.key} achievement={achievement} />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {!showAllAchievements && achievements.unlockedCount === 0 && (
                    <p className="text-sm text-theme-muted">
                      No achievements earned yet. Complete tests and lessons to unlock badges.
                    </p>
                  )}
                </div>
              </div>
            )}
            <DailyRewardModal
              open={streakModalOpen}
              onClose={() => setStreakModalOpen(false)}
            />
          </div>

          {/* ── Social ── */}
          <div className="space-y-4">
            <SectionHeading title="Friends" description="Connect and race with other typists." />
            <FriendsPanel onFriendsChange={refreshStats} />
          </div>

          {/* ── Typing stats ── */}
          <div className="space-y-4">
            <SectionHeading title="Typing stats" />
            <div className="rounded-lg border border-theme-border bg-theme-card/50 p-5">
              <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-theme-muted">Tests completed</dt>
                  <dd className="text-white">{progress.totalTestsCompleted}</dd>
                </div>
                <div>
                  <dt className="text-theme-muted">Average WPM</dt>
                  <dd className="text-white">{Number(progress.averageWPM).toFixed(1)}</dd>
                </div>
            <div>
              <dt className="text-theme-muted">Best accuracy</dt>
              <dd className="text-white">{progress.bestAccuracy}%</dd>
            </div>
            <div>
              <dt className="text-theme-muted">Avg accuracy</dt>
              <dd className="text-white">{progress.averageAccuracy ?? 0}%</dd>
            </div>
                <div>
                  <dt className="text-theme-muted">Words typed</dt>
                  <dd className="text-white">{progress.totalWordsTyped.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-theme-muted">Current streak</dt>
                  <dd className="text-white">{progress.streak} days</dd>
                </div>
                <div>
                  <dt className="text-theme-muted">XP to next level</dt>
                  <dd className="text-white">{progress.xpToNextLevel}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* ── Practice personalization ── */}
          <div className="space-y-4">
            <SectionHeading
              title="Practice personalization"
              description="Shape your personalized practice text."
            />
            <div className="rounded-lg border border-theme-border bg-theme-card/50 p-5">
              <TypingPreferencesForm
                preferences={user?.typingPreferences ?? DEFAULT_TYPING_PREFERENCES}
                onSave={async (typingPreferences) => {
                  const updated = await updateProfile({ typingPreferences });
                  await refreshUser();
                  return updated;
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* ── Account ── */}
      <div className="space-y-4">
        <SectionHeading title="Account" />
        <div className="rounded-lg border border-theme-border bg-theme-card/50 p-5">
          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="mb-1 block text-xs text-theme-muted">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  className="w-full rounded-md border border-theme-border-strong bg-theme-bg px-3 py-2 text-sm text-white outline-none focus:border-theme-accent"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-xs text-theme-muted">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-theme-border-strong bg-theme-bg px-3 py-2 text-sm text-white outline-none focus:border-theme-accent"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-theme-accent px-4 py-2 text-sm font-medium text-white hover:bg-theme-accent-hover disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setUsername(user?.username || '');
                    setEmail(user?.email || '');
                  }}
                  className="rounded-md px-4 py-2 text-sm text-theme-muted hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-theme-muted">Username</dt>
                  <dd className="text-white">{user?.username}</dd>
                </div>
                <div>
                  <dt className="text-theme-muted">Email</dt>
                  <dd className="text-white">{user?.email}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="mt-4 text-sm text-theme-accent hover:text-theme-accent-hover"
              >
                Edit profile
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
