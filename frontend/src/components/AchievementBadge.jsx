import { getAchievementIcon } from '../utils/achievementIcons';

const AchievementBadge = ({ achievement }) => {
  const icon = getAchievementIcon(achievement.key);

  return (
    <div
      className={`rounded-lg border px-3 py-3 text-center ${
        achievement.unlocked
          ? 'border-theme-accent/30 bg-theme-accent/10'
          : 'border-theme-border bg-theme-card/30 opacity-50'
      }`}
      title={achievement.description}
    >
      <div
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-xl ${
          achievement.unlocked
            ? 'bg-theme-accent/20'
            : 'bg-theme-hover grayscale'
        }`}
        aria-hidden="true"
      >
        {icon}
      </div>
      <p
        className={`mt-2 text-xs font-medium leading-tight ${
          achievement.unlocked ? 'text-white' : 'text-theme-muted'
        }`}
      >
        {achievement.name}
      </p>
    </div>
  );
};

export default AchievementBadge;
