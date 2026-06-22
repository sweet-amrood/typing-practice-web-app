import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { getProgress } from '../services/progressService';
import {
  getDailyActivity,
  getHistory,
  getWeeklyActivity,
} from '../services/resultService';
import {
  formatDailyActivity,
  formatTimeSeries,
  formatWeeklyActivity,
} from '../utils/chartData';

const StatsContext = createContext(null);

export const StatsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);
  const [timeSeries, setTimeSeries] = useState([]);
  const [dailyActivity, setDailyActivity] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshStats = useCallback(async () => {
    if (!isAuthenticated) return null;

    setLoading(true);
    setError(null);

    try {
      const [progressData, historyData, dailyData, weeklyData] =
        await Promise.all([
          getProgress(),
          getHistory(),
          getDailyActivity(),
          getWeeklyActivity(),
        ]);

      setProgress(progressData);
      setHistory(historyData);
      setTimeSeries(formatTimeSeries(historyData));
      setDailyActivity(formatDailyActivity(dailyData));
      setWeeklyActivity(formatWeeklyActivity(weeklyData));

      return progressData;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshStats();
    } else {
      setProgress(null);
      setHistory([]);
      setTimeSeries([]);
      setDailyActivity([]);
      setWeeklyActivity([]);
    }
  }, [isAuthenticated, refreshStats]);

  const value = useMemo(
    () => ({
      progress,
      history,
      timeSeries,
      dailyActivity,
      weeklyActivity,
      loading,
      error,
      refreshStats,
    }),
    [
      progress,
      history,
      timeSeries,
      dailyActivity,
      weeklyActivity,
      loading,
      error,
      refreshStats,
    ]
  );

  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);

  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }

  return context;
};
