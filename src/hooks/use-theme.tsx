
import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light',
  storageKey = 'theme'
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);
  
  // Only run this effect on client-side
  useEffect(() => {
    setMounted(true);
    
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Use system preference if no stored theme
      setTheme('dark');
    }
  }, [storageKey]);
  
  useEffect(() => {
    if (!mounted) return;
    
    // Update localStorage when theme changes
    localStorage.setItem(storageKey, theme);
    
    // Apply theme class to document and remove the other one with a transition
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    // Add transition class to add smooth transitions between themes
    const transitionElement = document.createElement('style');
    transitionElement.appendChild(document.createTextNode(`
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
      }
    `));
    
    document.head.appendChild(transitionElement);
    
    // Remove the transition effect after it's complete to prevent it affecting other UI changes
    const timeoutId = setTimeout(() => {
      document.head.removeChild(transitionElement);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [theme, mounted, storageKey]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
