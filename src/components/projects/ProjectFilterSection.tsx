
import React from 'react';
import ProjectSearch from './ProjectSearch';
import ProjectCategories from './ProjectCategories';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';

const ProjectFilterSection: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    projects, 
    selectedCategory, 
    setSelectedCategory,
    handleOpenCreateDialog
  } = useProjectManagement();
  
  const { user } = useAuth();
  const permissions = useProjectPermissions(user?.role);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <ProjectSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        {permissions.canCreateProjects && (
          <Button 
            onClick={handleOpenCreateDialog} 
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
        onCategoryChange={setSelectedCategory}
      />
    </>
  );
};

export default ProjectFilterSection;
