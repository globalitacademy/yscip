
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Toggle } from '@/components/ui/toggle';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <Toggle
        pressed={theme === 'dark'}
        onPressedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
        className="p-2 bg-secondary dark:bg-gray-800 hover:bg-secondary/80 dark:hover:bg-gray-700 transition-colors rounded-md"
      >
        {theme === 'dark' ? (
          <Moon className="h-5 w-5 text-blue-300" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500" />
        )}
      </Toggle>
    </div>
  );
};
