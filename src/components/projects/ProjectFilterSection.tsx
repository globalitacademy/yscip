
import React from 'react';
import ProjectSearch from './ProjectSearch';
import ProjectCategories from './ProjectCategories';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectFilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNewProject: () => void;
  projects: ProjectTheme[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const ProjectFilterSection: React.FC<ProjectFilterSectionProps> = ({
  searchQuery,
  onSearchChange,
  onAddNewProject,
  projects,
  selectedCategory,
  onCategoryChange
}) => {
  const { user } = useAuth();
  const permissions = useProjectPermissions(user?.role);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <ProjectSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />
        
        {permissions.canCreateProjects && (
          <Button 
            onClick={onAddNewProject} 
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Նոր նախագիծ
          </Button>
        )}
      </div>

      <ProjectCategories 
        projects={projects}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
    </>
  );
};

export default ProjectFilterSection;
