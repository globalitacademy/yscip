import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Toggle } from '@/components/ui/toggle';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export const ThemeToggle: React.FC = () => {
  const {
    theme,
    setTheme
  } = useTheme();
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`, {
      duration: 1500,
      className: 'theme-transition'
    });
  };
  return <div className="flex items-center space-x-2">
      
    </div>;
};
export default ThemeToggle;