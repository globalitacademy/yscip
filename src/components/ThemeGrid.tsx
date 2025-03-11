
import React from 'react';
import { projectThemes } from '@/data/projectThemes';
import { useAuth } from '@/contexts/AuthContext';
import CategorySelector from '@/components/project/CategorySelector';
import ProjectCategoryBadges from '@/components/project/ProjectCategoryBadges';
import ProjectGrid from '@/components/project/ProjectGrid';
import ProjectActions from '@/components/project/ProjectActions';
import useProjectFiltering from '@/hooks/useProjectFiltering';

interface ThemeGridProps {
  limit?: number;
  createdProjects?: any[];
}

const ThemeGrid: React.FC<ThemeGridProps> = ({ limit, createdProjects = [] }) => {
  const { user } = useAuth();
  
  const {
    displayedProjects,
    categories,
    activeCategory,
    setActiveCategory,
    hasMore,
    loadMore,
    displayLimit,
    setDisplayLimit,
    limit: initialLimit,
    categoryFilteredProjects,
    userReservedProjectsCount
  } = useProjectFiltering({
    initialProjects: projectThemes,
    limit,
    createdProjects
  });
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setDisplayLimit(initialLimit || 6);
  };

  return (
    <div className="mt-12 text-left">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ծրագրերի թեմաներն ըստ կատեգորիաների</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <CategorySelector 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        
          <ProjectCategoryBadges 
            projectCount={categoryFilteredProjects.length}
            user={user}
            reservedProjectsCount={userReservedProjectsCount}
          />
        </div>

        <ProjectGrid projects={displayedProjects} />
        
        <ProjectActions 
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
};

export default ThemeGrid;
