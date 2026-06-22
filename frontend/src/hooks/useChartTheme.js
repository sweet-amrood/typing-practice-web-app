import { useMemo } from 'react';
import { readChartTheme } from '../utils/chartTheme';
import { useTheme } from '../context/ThemeContext';

export const useChartTheme = () => {
  const { activeTheme } = useTheme();

  return useMemo(() => readChartTheme(), [activeTheme]);
};
