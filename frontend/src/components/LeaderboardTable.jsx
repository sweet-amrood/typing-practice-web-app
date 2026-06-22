import { useState } from 'react';
import PlayerStatsModal from './PlayerStatsModal';
import UserDisplayName from './UserDisplayName';

const LeaderboardTable = ({ entries, weekly = false }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  if (!entries?.length) {
    return (
      <p className="rounded-lg border border-theme-border bg-theme-card/50 p-6 text-sm text-theme-muted">
        No rankings yet. Complete typing tests to appear on the board.
      </p>
    );
  }

  return (
    <>
      <p className="mb-2 text-xs text-theme-muted">Click a player to view full stats.</p>
      <div className="overflow-hidden rounded-xl border border-theme-border bg-theme-card/50">
        <table className="min-w-full text-sm">
          <thead className="border-b border-theme-border bg-theme-bg/40 text-left text-xs uppercase tracking-wider text-theme-muted">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Best WPM</th>
              <th className="hidden px-4 py-3 sm:table-cell">Avg WPM</th>
              {weekly && <th className="px-4 py-3">This week</th>}
              <th className="hidden px-4 py-3 md:table-cell">Level</th>
              <th className="hidden px-4 py-3 sm:table-cell">Accuracy</th>
              <th className="hidden px-4 py-3 lg:table-cell">Streak</th>
              <th className="hidden px-4 py-3 md:table-cell">Tests</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.userId}
                onClick={() =>
                  setSelectedPlayer({ userId: entry.userId, username: entry.username })
                }
                className="cursor-pointer border-b border-theme-border/50 transition-colors last:border-b-0 hover:bg-theme-hover/50"
              >
                <td className="px-4 py-3 font-semibold text-theme-accent">#{entry.rank}</td>
                <td className="px-4 py-3">
                  <UserDisplayName
                    name={entry.username}
                    badgeEmoji={entry.badgeEmoji}
                    title={
                      entry.titleName && entry.titleName !== 'Novice' ? entry.titleName : null
                    }
                    nameClassName="font-medium text-white"
                    titleClassName="text-xs text-theme-muted"
                  />
                </td>
                <td className="px-4 py-3 tabular-nums text-white">{entry.highestWPM}</td>
                <td className="hidden px-4 py-3 tabular-nums text-theme-text-secondary sm:table-cell">
                  {Number(entry.averageWPM).toFixed(1)}
                </td>
                {weekly && (
                  <td className="px-4 py-3 tabular-nums text-theme-text-secondary">
                    {entry.weeklyBestWPM ?? '—'}
                    {entry.weeklyTests ? (
                      <span className="ml-1 text-xs text-theme-muted">
                        ({entry.weeklyTests})
                      </span>
                    ) : null}
                  </td>
                )}
                <td className="hidden px-4 py-3 tabular-nums text-theme-muted md:table-cell">
                  {entry.currentLevel ?? 1}
                </td>
                <td className="hidden px-4 py-3 tabular-nums text-theme-muted sm:table-cell">
                  {entry.bestAccuracy}%
                </td>
                <td className="hidden px-4 py-3 tabular-nums text-theme-muted lg:table-cell">
                  {entry.streak ?? 0}d
                </td>
                <td className="hidden px-4 py-3 tabular-nums text-theme-muted md:table-cell">
                  {entry.totalTestsCompleted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPlayer && (
        <PlayerStatsModal
          userId={selectedPlayer.userId}
          username={selectedPlayer.username}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </>
  );
};

export default LeaderboardTable;
