
import { useTheme } from '@/hooks/use-theme';

type ThemeMode = 'light' | 'dark';

/**
 * Get the appropriate color class for a category badge based on theme
 */
export const getCategoryBadgeClass = (category: string = '', theme: ThemeMode = 'light'): string => {
  const isDark = theme === 'dark';
  
  // Base class for light/dark mode
  let baseClass = isDark 
    ? "bg-gray-800 text-gray-200" 
    : "bg-gray-100 text-gray-800";
  
  // Category-specific colors for courses
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
        ? "bg-amber-900/60 text-amber-300" 
        : "bg-amber-100 text-amber-800";
    default:
      return baseClass;
  }
};

/**
 * Get the appropriate color class for an institution badge based on theme
 */
export const getInstitutionBadgeClass = (theme: ThemeMode = 'light'): string => {
  const isDark = theme === 'dark';
  
  return isDark 
    ? "bg-gray-800/80 text-gray-200 border-gray-700" 
    : "bg-gray-100 text-gray-800 border-gray-200";
};

/**
 * Hook for getting theme-specific badge classes for courses
 */
export const useBadgeThemeClasses = () => {
  const { theme } = useTheme();
  
  return {
    getCategoryClass: (category: string) => getCategoryBadgeClass(category, theme),
    getInstitutionClass: () => getInstitutionBadgeClass(theme),
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
