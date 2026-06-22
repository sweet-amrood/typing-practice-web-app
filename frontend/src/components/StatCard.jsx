const StatCard = ({ label, value, hint, accent = 'theme' }) => {
  const accents = {
    theme: 'border-theme-accent/20 bg-theme-accent/5',
    emerald: 'border-emerald-500/20 bg-emerald-500/5',
    amber: 'border-amber-500/20 bg-amber-500/5',
    accent: 'border-theme-accent/25 bg-theme-accent/10',
    rose: 'border-rose-500/20 bg-rose-500/5',
  };

  return (
    <article
      className={`rounded-xl border p-5 shadow-lg ${accents[accent] ?? accents.theme}`}
    >
      <p className="text-sm font-medium text-theme-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-theme-muted">{hint}</p>}
    </article>
  );
};

export default StatCard;
