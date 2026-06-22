import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TOKEN_KEY } from '../services/api';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const shouldShowDailyReward = () =>
  sessionStorage.getItem('dailyRewardSeen') !== getTodayKey();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const [showDailyReward, setShowDailyReward] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem('dailyRewardSeen');
    setToken(null);
    setUser(null);
    setShowDailyReward(false);
  }, []);

  const dismissDailyReward = useCallback(() => {
    setShowDailyReward(false);
  }, []);

  const triggerDailyReward = useCallback(() => {
    if (shouldShowDailyReward()) {
      setShowDailyReward(true);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        const userData = await authService.getMe();
        setUser(userData);
        if (shouldShowDailyReward()) {
          setShowDailyReward(true);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const { user: userData, token: authToken } = await authService.login(
      email,
      password
    );

    localStorage.setItem(TOKEN_KEY, authToken);
    setToken(authToken);
    setUser(userData);
    triggerDailyReward();

    return userData;
  };

  const signup = async (username, email, password) => {
    const { user: userData, token: authToken } = await authService.register(
      username,
      email,
      password
    );

    localStorage.setItem(TOKEN_KEY, authToken);
    setToken(authToken);
    setUser(userData);
    triggerDailyReward();

    return userData;
  };

  const refreshUser = useCallback(async () => {
    const userData = await authService.getMe();
    setUser(userData);
    return userData;
  }, []);

  const updateProfile = useCallback(async (profile) => {
    const userData = await authService.updateProfile(profile);
    setUser(userData);
    return userData;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      showDailyReward,
      dismissDailyReward,
      triggerDailyReward,
      login,
      signup,
      logout,
      refreshUser,
      updateProfile,
    }),
    [
      user,
      token,
      loading,
      showDailyReward,
      dismissDailyReward,
      triggerDailyReward,
      logout,
      refreshUser,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
