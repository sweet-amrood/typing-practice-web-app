import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';
import { getTitleName } from '../utils/titles';
import { NavbarCoinBar, NavbarXpBar } from './NavbarStats';
import FriendRequestBell from './FriendRequestBell';
import ProfileMenu from './ProfileMenu';

const LESSON_MODES = ['beginner', 'intermediate', 'advanced'];

const isLessonTestRoute = (pathname, search) => {
  if (pathname !== '/test') return false;
  const params = new URLSearchParams(search);
  const mode = params.get('mode');
  const level = Number(params.get('level'));
  return (
    LESSON_MODES.includes(mode) &&
    Number.isInteger(level) &&
    level >= 1 &&
    level <= 30
  );
};

const navLinkClass = ({ isActive }) =>
  `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-theme-accent text-white shadow-sm shadow-theme-accent/25'
      : 'text-theme-text-secondary hover:bg-theme-hover/80 hover:text-white'
  }`;

const guestLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'text-white'
      : 'text-theme-text-secondary hover:text-white'
  }`;

const Logo = () => (
  <NavLink to="/" className="group flex items-center gap-2.5">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-theme-accent/20 text-lg shadow-inner shadow-theme-accent/10 transition-colors group-hover:bg-theme-accent/30">
      ⌨
    </span>
    <span className="hidden sm:block">
      <span className="block text-sm font-bold leading-none text-white">Typing</span>
      <span className="block text-xs font-medium text-theme-accent">Practice</span>
    </span>
  </NavLink>
);

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { progress } = useStats();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const onLessonPage = isLessonTestRoute(location.pathname, location.search);

  const titleName = progress?.activeTitle
    ? getTitleName(progress.activeTitle, progress.titles)
    : null;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const primaryLinks = isAuthenticated
    ? [
        { to: '/test', label: 'Practice', isActive: () => location.pathname === '/test' && !onLessonPage },
        { to: '/lessons', label: 'Lessons', isActive: () => location.pathname === '/lessons' || onLessonPage },
        { to: '/race', label: 'Race' },
        { to: '/leaderboard', label: 'Leaderboard' },
      ]
    : [];

  const secondaryLinks = isAuthenticated
    ? [
        { to: '/coach', label: 'Coach' },
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/shop', label: 'Shop' },
      ]
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-theme-border/80 bg-theme-bg/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <Logo />

          {isAuthenticated && progress && (
            <div className="hidden items-center gap-2 border-l border-theme-border pl-3 md:flex">
              <NavbarXpBar
                level={progress.currentLevel}
                xp={progress.xp}
                xpInLevel={progress.xpInLevel}
                xpRequiredForLevel={progress.xpRequiredForLevel}
                xpToNextLevel={progress.xpToNextLevel}
                levelProgressPercent={progress.levelProgressPercent}
              />
              <NavbarCoinBar coins={progress.coins} />
            </div>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {!isAuthenticated && (
            <NavLink to="/" className={guestLinkClass} end>
              Home
            </NavLink>
          )}

          {isAuthenticated && (
            <div className="flex items-center gap-1 rounded-xl bg-theme-hover/40 p-1">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={navLinkClass}
                  isActive={link.isActive}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}

          {isAuthenticated &&
            secondaryLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}

          {isAuthenticated && <FriendRequestBell />}

          {isAuthenticated ? (
            <ProfileMenu
              username={user?.username}
              title={titleName}
              cosmetics={progress?.cosmetics}
              badgeEmoji={
                progress?.cosmetics?.badges?.find((item) => item.equipped)?.emoji
                ?? progress?.cosmetics?.icons?.find((item) => item.equipped)?.emoji
              }
              onLogout={handleLogout}
            />
          ) : (
            <>
              <NavLink to="/login" className={guestLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-xl bg-theme-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-theme-accent/20 hover:bg-theme-accent-hover"
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && <FriendRequestBell />}
          {isAuthenticated && (
            <ProfileMenu
              username={user?.username}
              title={titleName}
              cosmetics={progress?.cosmetics}
              badgeEmoji={
                progress?.cosmetics?.badges?.find((item) => item.equipped)?.emoji
                ?? progress?.cosmetics?.icons?.find((item) => item.equipped)?.emoji
              }
              onLogout={handleLogout}
            />
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-theme-border-strong text-theme-text-secondary"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-theme-border bg-theme-card/95 px-4 py-4 md:hidden">
          {isAuthenticated && progress && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <NavbarXpBar
                level={progress.currentLevel}
                xp={progress.xp}
                xpInLevel={progress.xpInLevel}
                xpRequiredForLevel={progress.xpRequiredForLevel}
                xpToNextLevel={progress.xpToNextLevel}
                levelProgressPercent={progress.levelProgressPercent}
              />
              <NavbarCoinBar coins={progress.coins} />
            </div>
          )}

          <div className="flex flex-col gap-1">
            {!isAuthenticated && (
              <NavLink to="/" className={navLinkClass} end>
                Home
              </NavLink>
            )}

            {[...primaryLinks, ...secondaryLinks].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkClass}
                isActive={link.isActive}
              >
                {link.label}
              </NavLink>
            ))}

            {!isAuthenticated && (
              <div className="mt-3 flex flex-col gap-2">
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-xl bg-theme-accent py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get Started
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
