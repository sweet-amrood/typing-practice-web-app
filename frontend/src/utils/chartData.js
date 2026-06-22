export const formatWeeklyActivity = (activity) =>
  activity.map((week) => ({
    label: `W${week.week}`,
    week: week.week,
    year: week.year,
    tests: week.tests,
    avgWpm: week.avgWpm,
    avgAccuracy: week.avgAccuracy,
  }));

export const formatDateLabel = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

export const formatTimeSeries = (results) =>
  [...results]
    .reverse()
    .map((result) => ({
      date: result.date,
      label: formatDateLabel(result.date),
      wpm: result.wpm,
      accuracy: result.accuracy,
    }));

export const formatDailyActivity = (activity) =>
  activity.map((day) => ({
    date: day.date,
    label: formatDateLabel(day.date),
    tests: day.tests,
    avgWpm: day.avgWpm,
    avgAccuracy: day.avgAccuracy,
  }));
