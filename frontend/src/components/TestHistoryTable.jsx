import { CoinIcon, XpIcon } from './RewardIcons';

const TestHistoryTable = ({ history }) => {
  if (!history.length) {
    return (
      <p className="py-8 text-center text-sm text-theme-muted">No tests yet</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-theme-border text-xs text-theme-muted">
            <th className="pb-2 pr-4 font-medium">Date</th>
            <th className="pb-2 pr-4 font-medium">WPM</th>
            <th className="pb-2 pr-4 font-medium">Accuracy</th>
            <th className="pb-2 pr-4 font-medium">Time</th>
            <th className="pb-2 pr-4 font-medium">XP</th>
            <th className="pb-2 font-medium">Coins</th>
          </tr>
        </thead>
        <tbody>
          {history.map((test) => (
            <tr key={test._id} className="border-b border-theme-border/50">
              <td className="py-2.5 pr-4 text-theme-text-secondary">
                {new Date(test.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="py-2.5 pr-4 text-white">{test.wpm}</td>
              <td className="py-2.5 pr-4 text-white">{test.accuracy}%</td>
              <td className="py-2.5 pr-4 text-theme-muted">{test.duration}s</td>
              <td className="py-2.5 pr-4">
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <XpIcon className="h-3.5 w-3.5" />
                  {test.xpEarned ?? 0}
                </span>
              </td>
              <td className="py-2.5">
                <span className="inline-flex items-center gap-1 text-yellow-300">
                  <CoinIcon className="h-3.5 w-3.5" />
                  {test.coinsEarned ?? 0}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestHistoryTable;
