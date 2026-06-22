const inputClass =
  'w-full rounded-xl border border-theme-border-strong bg-theme-bg/80 px-4 py-2.5 text-white outline-none transition-colors placeholder:text-theme-muted/60 focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20';

export const AuthField = ({ id, label, hint, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-theme-text-secondary">
      {label}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-theme-muted">{hint}</p>}
  </div>
);

export const AuthInput = (props) => <input className={inputClass} {...props} />;

export const AuthError = ({ message }) =>
  message ? (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      {message}
    </div>
  ) : null;

export const AuthSubmit = ({ children, disabled }) => (
  <button
    type="submit"
    disabled={disabled}
    className="w-full rounded-xl bg-theme-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-theme-accent/20 transition-all hover:bg-theme-accent-hover hover:shadow-theme-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {children}
  </button>
);
