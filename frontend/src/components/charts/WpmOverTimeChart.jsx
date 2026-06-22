import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useChartTheme } from '../../hooks/useChartTheme';
import { buildChartTooltip, chartAxisProps } from '../../utils/chartTheme';

const WpmOverTimeChart = ({ data }) => {
  const theme = useChartTheme();
  const tooltipStyle = useMemo(() => buildChartTooltip(theme), [theme]);
  const axisProps = useMemo(() => chartAxisProps(theme), [theme]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" />
        <XAxis dataKey="label" {...axisProps} minTickGap={24} />
        <YAxis {...axisProps} allowDecimals={false} />
        <Tooltip
          {...tooltipStyle}
          formatter={(value) => [`${value} WPM`, 'Speed']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="wpm"
          stroke={theme.accent}
          strokeWidth={2}
          dot={{ fill: theme.accent, r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WpmOverTimeChart;
