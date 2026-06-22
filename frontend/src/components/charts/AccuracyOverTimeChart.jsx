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

const AccuracyOverTimeChart = ({ data }) => {
  const theme = useChartTheme();
  const tooltipStyle = useMemo(() => buildChartTooltip(theme), [theme]);
  const axisProps = useMemo(() => chartAxisProps(theme), [theme]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" />
        <XAxis dataKey="label" {...axisProps} minTickGap={24} />
        <YAxis domain={[0, 100]} {...axisProps} />
        <Tooltip
          {...tooltipStyle}
          formatter={(value) => [`${value}%`, 'Accuracy']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="accuracy"
          stroke={theme.success}
          strokeWidth={2}
          dot={{ fill: theme.success, r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AccuracyOverTimeChart;
