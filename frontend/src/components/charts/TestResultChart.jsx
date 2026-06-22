import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useChartTheme } from '../../hooks/useChartTheme';
import { buildChartTooltip, chartAxisProps } from '../../utils/chartTheme';

const TestResultChart = ({ results }) => {
  const theme = useChartTheme();
  const tooltipStyle = useMemo(() => buildChartTooltip(theme), [theme]);
  const axisProps = useMemo(() => chartAxisProps(theme), [theme]);

  const data = [
    {
      key: 'wpm',
      metric: 'WPM',
      value: results.wpm,
      display: `${results.wpm}`,
      color: theme.accent,
    },
    {
      key: 'accuracy',
      metric: 'Accuracy',
      value: results.accuracy,
      display: `${results.accuracy}%`,
      color: theme.success,
    },
    {
      key: 'mistakes',
      metric: 'Errors',
      value: results.mistakes,
      display: `${results.mistakes}`,
      color: theme.danger,
    },
    {
      key: 'duration',
      metric: 'Time',
      value: results.duration,
      display: `${results.duration}s`,
      color: theme.accentHover,
    },
  ];

  return (
    <div className="h-56 w-full min-w-0 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" />
          <XAxis dataKey="metric" {...axisProps} />
          <YAxis {...axisProps} allowDecimals={false} />
          <Tooltip
            {...tooltipStyle}
            formatter={(_, __, item) => [item.payload.display, item.payload.metric]}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TestResultChart;
