
import React, { useEffect, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { filterProjects } from './ProjectUtils';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import ProjectCard from './ProjectCard';
import ProjectEmptyState from './ProjectEmptyState';
import { useAuth } from '@/contexts/AuthContext';

const ProjectList: React.FC = () => {
  const {
    projects,
    searchQuery,
    selectedCategory,
    isLoading,
    handleEditInit,
    handleImageChangeInit,
    handleDeleteInit,
    handleOpenCreateDialog,
    loadProjects
  } = useProjectManagement();

  const { user } = useAuth();
  
  // Load projects when component mounts
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);
  
  // Memoize filtered projects to prevent unnecessary recalculations
  const filteredProjects = useMemo(() => {
    return filterProjects(projects, searchQuery, selectedCategory);
  }, [projects, searchQuery, selectedCategory]);
  
  // Memoize user's own projects
  const userProjects = useMemo(() => {
    return projects.filter(project => project.createdBy === user?.id);
  }, [projects, user?.id]);

  // Memoize permission checks
  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);
  const isCreator = useMemo(() => 
    ['admin', 'instructor', 'supervisor', 'project_manager'].includes(user?.role || ''),
    [user?.role]
  );

  // Create memoized handler functions
  const canEditOrDelete = useCallback((projectCreatorId: string | undefined) => {
    return isAdmin || projectCreatorId === user?.id;
  }, [isAdmin, user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return <ProjectEmptyState onAddNewProject={handleOpenCreateDialog} />;
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">Բոլոր նախագծերը</TabsTrigger>
        {isCreator && (
          <TabsTrigger value="my">Իմ նախագծերը</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="all" className="space-y-4 mt-4">
        {filteredProjects.length === 0 ? (
          <p className="text-center text-gray-500">Նախագծեր չկան</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                className="h-full"
                onEdit={canEditOrDelete(project.createdBy) ? handleEditInit : undefined}
                onImageChange={canEditOrDelete(project.createdBy) ? handleImageChangeInit : undefined}
                onDelete={canEditOrDelete(project.createdBy) ? handleDeleteInit : undefined}
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      {isCreator && (
        <TabsContent value="my" className="space-y-4 mt-4">
          {userProjects.length === 0 ? (
            <p className="text-center text-gray-500">Դուք դեռ չունեք ավելացված նախագծեր</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  className="h-full"
                  onEdit={handleEditInit}
                  onImageChange={handleImageChangeInit}
                  onDelete={handleDeleteInit}
                />
              ))}
            </div>
          )}
        </TabsContent>
      )}
    </Tabs>
  );
};

export default React.memo(ProjectList);
