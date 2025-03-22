
import React, { useMemo } from 'react';
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
    handleOpenCreateDialog
  } = useProjectManagement();

  const { user } = useAuth();
  
  const filteredProjects = useMemo(() => {
    return filterProjects(projects, searchQuery, selectedCategory);
  }, [projects, searchQuery, selectedCategory]);
  
  // Filter user's own projects
  const userProjects = useMemo(() => {
    return projects.filter(project => project.createdBy === user?.id);
  }, [projects, user?.id]);

  const isAdmin = user?.role === 'admin';
  const isCreator = ['admin', 'instructor', 'supervisor', 'project_manager'].includes(user?.role || '');

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
                onEdit={isAdmin || project.createdBy === user?.id ? handleEditInit : undefined}
                onImageChange={isAdmin || project.createdBy === user?.id ? handleImageChangeInit : undefined}
                onDelete={isAdmin || project.createdBy === user?.id ? handleDeleteInit : undefined}
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

export default ProjectList;
