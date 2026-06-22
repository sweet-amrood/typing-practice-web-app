import UserAvatar from './UserAvatar';
import { CoinIcon, XpIcon } from './RewardIcons';

const LevelUpModal = ({ event, cosmetics, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-theme-bg/85 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-theme-accent/40 bg-gradient-to-b from-theme-accent/20 via-theme-card to-theme-bg p-6 shadow-2xl shadow-theme-accent/20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-theme-accent">
            Level up
          </p>
          <div className="mt-4 flex justify-center">
            <UserAvatar
              image={cosmetics?.avatarImage}
              frameStyle={cosmetics?.frameStyle ?? 'slate'}
              size="lg"
            />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white">
            Level {event.newLevel}
          </h2>
          <p className="mt-2 text-sm text-theme-muted">
            You climbed from level {event.previousLevel} to {event.newLevel}.
          </p>
        </div>

        <ul className="mt-6 space-y-2">
          {event.loot?.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between rounded-lg border border-theme-border bg-theme-bg/50 px-3 py-2 text-sm"
            >
              <span className="text-theme-text-secondary">{item.label}</span>
              <span className="flex items-center gap-1 font-medium text-white">
                {item.type === 'coins' && <CoinIcon className="h-4 w-4" />}
                {item.type === 'xp' && <XpIcon className="h-4 w-4" />}
                {item.type === 'loot' && '✨'}
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-theme-accent py-2.5 text-sm font-semibold text-white hover:bg-theme-accent-hover"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
