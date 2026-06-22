export const TIER_STYLES = {
  failed: {
    label: 'Keep practicing',
    title: 'Not quite yet',
    accent: 'text-amber-300',
    bg: 'border-amber-500/20 bg-amber-500/10',
  },
  pass: {
    label: 'Good job',
    title: 'Level passed',
    accent: 'text-theme-accent',
    bg: 'border-theme-accent/20 bg-theme-accent/10',
  },
  best: {
    label: 'New personal best',
    title: 'Personal best',
    accent: 'text-theme-accent-hover',
    bg: 'border-theme-accent/25 bg-theme-accent/10',
  },
  perfect: {
    label: 'Perfect accuracy',
    title: 'Perfect run',
    accent: 'text-emerald-300',
    bg: 'border-emerald-500/20 bg-emerald-500/10',
  },
  legendary: {
    label: 'Perfect personal best',
    title: 'Legendary run',
    accent: 'text-theme-accent-hover',
    bg: 'border-theme-accent/30 bg-theme-accent/10',
  },
};

export const getTierStyle = (tier) =>
  TIER_STYLES[tier] ?? TIER_STYLES.pass;
