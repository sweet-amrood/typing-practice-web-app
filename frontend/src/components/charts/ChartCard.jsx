const ChartCard = ({
  title,
  description,
  children,
  emptyMessage,
  contentClassName = 'h-64',
}) => {
  return (
    <article className="rounded-xl border border-theme-border bg-theme-card p-4 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-theme-muted">{description}</p>
        )}
      </div>

      {emptyMessage ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-theme-border-strong text-sm text-theme-muted">
          {emptyMessage}
        </div>
      ) : (
        <div className={`w-full min-w-0 ${contentClassName}`}>{children}</div>
      )}
    </article>
  );
};

export default ChartCard;
