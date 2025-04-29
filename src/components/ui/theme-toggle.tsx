
import React from 'react';
import { Moon, Sun, Edit, Save } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Toggle } from '@/components/ui/toggle';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useProject } from '@/contexts/ProjectContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { isEditing } = useProject();
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`, {
      duration: 1500,
      className: 'theme-transition',
    });
  };
  
  // If in editing mode, show a different colored toggle with edit icon
  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Toggle
          pressed={theme === 'dark'}
          onPressedChange={toggleTheme}
          aria-label={`Toggle ${theme === 'dark' ? 'light' : 'dark'} theme (editing mode)`}
          className={cn(
            'p-2 transition-colors rounded-md border',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
            theme === 'dark' 
              ? 'bg-amber-900/60 hover:bg-amber-800 border-amber-700/50' 
              : 'bg-amber-100 hover:bg-amber-200 border-amber-300'
          )}
        >
          {theme === 'dark' ? (
            <Edit className="h-5 w-5 text-amber-300 transition-transform duration-500 rotate-0" />
          ) : (
            <Edit className="h-5 w-5 text-amber-600 transition-transform duration-500 rotate-0" />
          )}
        </Toggle>
      </div>
    );
  }
  
  // Standard theme toggle
  return (
    <div className="flex items-center space-x-2">
      <Toggle
        pressed={theme === 'dark'}
        onPressedChange={toggleTheme}
        aria-label={`Toggle ${theme === 'dark' ? 'light' : 'dark'} theme`}
        className={cn(
          'p-2 transition-colors rounded-md border',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
          theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' 
            : 'bg-secondary/80 hover:bg-secondary/60 border-transparent'
        )}
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

export default ThemeToggle;
