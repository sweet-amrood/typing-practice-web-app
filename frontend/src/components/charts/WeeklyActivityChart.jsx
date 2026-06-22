import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useChartTheme } from '../../hooks/useChartTheme';
import { buildChartTooltip, chartAxisProps } from '../../utils/chartTheme';

const WeeklyActivityChart = ({ data }) => {
  const theme = useChartTheme();
  const tooltipStyle = useMemo(() => buildChartTooltip(theme), [theme]);
  const axisProps = useMemo(() => chartAxisProps(theme), [theme]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis allowDecimals={false} {...axisProps} />
        <Tooltip
          {...tooltipStyle}
          formatter={(value) => [value, 'Tests']}
          labelFormatter={(label) => `Week ${label.replace('W', '')}`}
        />
        <Bar dataKey="tests" fill={theme.accent} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyActivityChart;
