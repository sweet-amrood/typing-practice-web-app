import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import DailyRewardModal from './DailyRewardModal';
import Navbar from './Navbar';
import ThemeDecorations from './theming/ThemeDecorations';
import { useAuth } from '../context/AuthContext';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const Layout = () => {
  const { isAuthenticated, loading, showDailyReward, dismissDailyReward } =
    useAuth();
  const [dailyOpen, setDailyOpen] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && showDailyReward) {
      setDailyOpen(true);
    }
  }, [loading, isAuthenticated, showDailyReward]);

  const handleCloseDaily = () => {
    setDailyOpen(false);
    dismissDailyReward();
    sessionStorage.setItem('dailyRewardSeen', getTodayKey());
  };

  return (
    <div className="relative min-h-screen">
      <ThemeDecorations />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <DailyRewardModal open={dailyOpen} onClose={handleCloseDaily} />
    </div>
  );
};

export default Layout;
