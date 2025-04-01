
import { useState, useCallback } from 'react';
import { ProjectTheme } from '@/data/projectThemes';

/**
 * Hook for handling project filters (search and category)
 */
export const useProjectFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filterProjects = useCallback((projects: ProjectTheme[]) => {
    return projects.filter(project => {
      // Apply search filter
      const searchMatch = !searchQuery || 
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply category filter
      const categoryMatch = !selectedCategory || project.category === selectedCategory;
      
      return searchMatch && categoryMatch;
    });
  }, [searchQuery, selectedCategory]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterProjects
  };
};
