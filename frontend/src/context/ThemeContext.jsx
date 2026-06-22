import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { applyTheme, DEFAULT_THEME } from '../utils/themes';
import { getProgress } from '../services/progressService';
import { useAuth } from './AuthContext';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activeTheme, setActiveTheme] = useState(DEFAULT_THEME);
  const [themes, setThemes] = useState([]);

  const loadThemes = useCallback(async () => {
    const data = await getProgress();
    setActiveTheme(data.activeTheme ?? DEFAULT_THEME);
    setThemes(data.themes ?? []);
    applyTheme(data.activeTheme ?? DEFAULT_THEME);
    return data;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setActiveTheme(DEFAULT_THEME);
      setThemes([]);
      applyTheme(DEFAULT_THEME);
      return;
    }

    loadThemes().catch(() => applyTheme(DEFAULT_THEME));
  }, [isAuthenticated, loadThemes]);

  const setThemeData = useCallback((data) => {
    setActiveTheme(data.activeTheme ?? DEFAULT_THEME);
    setThemes(data.themes ?? []);
    applyTheme(data.activeTheme ?? DEFAULT_THEME);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        themes,
        loadThemes,
        setThemeData,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    return {
      activeTheme: DEFAULT_THEME,
      themes: [],
      loadThemes: async () => null,
      setThemeData: () => {},
    };
  }

  return context;
};
