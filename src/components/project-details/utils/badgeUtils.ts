
import { useTheme } from '@/hooks/use-theme';

type ThemeMode = 'light' | 'dark';

/**
 * Get the appropriate color class for a project category badge based on theme
 */
export const getCategoryBadgeClass = (category: string = '', theme: ThemeMode = 'light'): string => {
  const isDark = theme === 'dark';
  
  // Base class for light/dark mode
  let baseClass = isDark 
    ? "bg-slate-800 text-slate-200" 
    : "bg-gray-100 text-gray-800";
  
  // Category-specific colors
  switch (category.toLowerCase()) {
    case 'web development':
    case 'web':
      return isDark 
        ? "bg-blue-900/60 text-blue-300" 
        : "bg-blue-100 text-blue-800";
    case 'mobile':
    case 'mobile development':
      return isDark 
        ? "bg-green-900/60 text-green-300" 
        : "bg-green-100 text-green-800";
    case 'ai':
    case 'machine learning':
      return isDark 
        ? "bg-purple-900/60 text-purple-300" 
        : "bg-purple-100 text-purple-800";
    case 'data science':
      return isDark 
        ? "bg-yellow-900/60 text-yellow-300" 
        : "bg-yellow-100 text-yellow-800";
    default:
      return baseClass;
  }
};

/**
 * Get the appropriate color class for a complexity badge based on theme
 */
export const getComplexityBadgeClass = (complexity: string = 'Միջին', theme: ThemeMode = 'light'): string => {
  const isDark = theme === 'dark';
  
  if (complexity === 'Սկսնակ') {
    return isDark 
      ? "bg-green-900/60 text-green-300 border-green-800" 
      : "bg-green-100 text-green-800 border-green-200";
  } else if (complexity === 'Առաջադեմ') {
    return isDark 
      ? "bg-red-900/60 text-red-300 border-red-800" 
      : "bg-red-100 text-red-800 border-red-200";
  }
  
  // Default for Միջին
  return isDark 
    ? "bg-yellow-900/60 text-yellow-300 border-yellow-800" 
    : "bg-yellow-100 text-yellow-800 border-yellow-200";
};

/**
 * Hook for getting theme-specific badge classes
 */
export const useBadgeThemeClasses = () => {
  const { theme } = useTheme();
  
  return {
    getCategoryClass: (category: string) => getCategoryBadgeClass(category, theme),
    getComplexityClass: (complexity: string) => getComplexityBadgeClass(complexity, theme),
    getPublicBadgeClass: () => {
      return theme === 'dark' 
        ? "bg-green-900/60 text-green-300" 
        : "bg-green-100 text-green-800";
    },
    getPrivateBadgeClass: () => {
      return theme === 'dark' 
        ? "bg-amber-900/60 text-amber-300" 
        : "bg-amber-100 text-amber-800";
    }
  };
};
