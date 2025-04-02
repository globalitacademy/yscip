
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="relative w-9 h-9 rounded-full overflow-hidden"
    >
      <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out" 
            style={{ opacity: theme === 'dark' ? 1 : 0 }}>
        <Sun className="h-5 w-5 text-yellow-400 transition-all" />
      </span>
      <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out" 
            style={{ opacity: theme === 'light' ? 1 : 0 }}>
        <Moon className="h-5 w-5 text-slate-700 transition-all" />
      </span>
    </Button>
  );
};
