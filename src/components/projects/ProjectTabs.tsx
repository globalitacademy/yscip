
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import ProjectList from './ProjectList';
import ProjectEmptyState from './ProjectEmptyState';

const ProjectTabs: React.FC = () => {
  const { user } = useAuth();
  const { 
    projects, 
    loadProjects, 
    searchQuery, 
    selectedCategory 
  } = useProjectManagement();

  // Load projects when component mounts
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    // Only show projects that are public or created by the current user
    const visibilityMatch = project.is_public || project.createdBy === user?.id;
    
    // Filter by search query
    const searchMatch = !searchQuery || 
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by selected category
    const categoryMatch = !selectedCategory || project.category === selectedCategory;
    
    return visibilityMatch && searchMatch && categoryMatch;
  });

  return (
    <Tabs defaultValue="all">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="all">Բոլոր նախագծերը</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="focus:outline-none">
        {filteredProjects.length === 0 ? (
          <ProjectEmptyState 
            onAddNewProject={() => {}} 
          />
        ) : (
          <ProjectList projects={filteredProjects} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
