
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Toggle } from '@/components/ui/toggle';
import { toast } from 'sonner';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`, {
      duration: 1500,
    });
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Toggle
        pressed={theme === 'dark'}
        onPressedChange={toggleTheme}
        aria-label="Toggle theme"
        className="p-2 bg-secondary/80 dark:bg-gray-800 hover:bg-secondary/60 dark:hover:bg-gray-700 transition-colors rounded-md border border-transparent dark:border-gray-700 shadow-sm"
      >
        {theme === 'dark' ? (
          <Moon className="h-5 w-5 text-blue-300 transition-transform duration-500 rotate-0" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500 transition-transform duration-500 rotate-0" />
        )}
      </Toggle>
    </div>
  );
};
