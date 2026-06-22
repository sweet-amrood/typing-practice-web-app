import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import UserDisplayName from './UserDisplayName';

const ProfileMenu = ({ username, title, cosmetics, badgeEmoji, onLogout }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const onProfile = location.pathname === '/profile';

  const equippedFrame = cosmetics?.frames?.find((item) => item.equipped);
  const equippedBadge = cosmetics?.badges?.find((item) => item.equipped)
    ?? cosmetics?.icons?.find((item) => item.equipped);

  useEffect(() => {
    if (!open) return undefined;

    const handleClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`rounded-xl transition-colors ${
          onProfile || open ? 'ring-2 ring-theme-accent/40' : ''
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Profile menu"
        title={username}
      >
        <UserAvatar
          image={cosmetics?.avatarImage}
          frameStyle={equippedFrame?.style ?? 'slate'}
          size="sm"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-theme-border bg-theme-card shadow-xl"
          role="menu"
        >
          <div className="border-b border-theme-border bg-theme-bg/40 px-4 py-3">
            <UserDisplayName
              name={username}
              badgeEmoji={badgeEmoji ?? equippedBadge?.emoji}
              title={title}
              nameClassName="truncate text-sm font-medium text-white"
              titleClassName="truncate text-xs text-theme-accent"
            />
          </div>

          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => goTo('/profile')}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                onProfile
                  ? 'bg-theme-accent/20 text-theme-accent'
                  : 'text-theme-text-secondary hover:bg-theme-hover hover:text-white'
              }`}
            >
              Profile
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => goTo('/shop')}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-theme-text-secondary transition-colors hover:bg-theme-hover hover:text-white"
            >
              Shop
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-theme-muted transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
