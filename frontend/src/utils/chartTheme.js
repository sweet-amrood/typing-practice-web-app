export const readChartTheme = () => {
  if (typeof window === 'undefined') {
    return {
      card: '#0f172a',
      border: '#334155',
      text: '#f8fafc',
      muted: '#94a3b8',
      accent: '#6366f1',
      accentHover: '#818cf8',
      grid: '#1e293b',
      success: '#34d399',
      danger: '#f87171',
    };
  }

  const styles = getComputedStyle(document.body);
  const get = (name, fallback) => styles.getPropertyValue(name).trim() || fallback;

  return {
    card: get('--theme-card', '#0f172a'),
    border: get('--theme-border-strong', '#334155'),
    text: get('--theme-text', '#f8fafc'),
    muted: get('--theme-muted', '#94a3b8'),
    accent: get('--theme-accent', '#6366f1'),
    accentHover: get('--theme-accent-hover', '#818cf8'),
    grid: get('--theme-border', '#1e293b'),
    success: '#34d399',
    danger: '#f87171',
  };
};

export const buildChartTooltip = (theme) => ({
  contentStyle: {
    backgroundColor: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: '0.5rem',
    color: theme.text,
  },
  labelStyle: { color: theme.muted },
});

export const chartAxisProps = (theme) => ({
  tick: { fill: theme.muted, fontSize: 12 },
  axisLine: { stroke: theme.border },
  tickLine: { stroke: theme.border },
});
