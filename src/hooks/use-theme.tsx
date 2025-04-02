
import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Use system preference if no stored theme
      setTheme('dark');
    }
  }, []);
  
  // Apply theme changes to document and localStorage
  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('theme', theme);
    
    const root = document.documentElement;
    
    // Remove both classes first to ensure clean state
    root.classList.remove('light', 'dark');
    
    // Apply new theme with transition classes
    root.classList.add(theme);
    root.classList.add('theme-transition');
    
    // Remove the transition class after the transition completes
    const transitionTimeout = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
    
    return () => clearTimeout(transitionTimeout);
  }, [theme, mounted]);
  
  const value = {
    theme,
    setTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
