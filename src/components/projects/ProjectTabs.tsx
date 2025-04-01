
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

  // Filter projects based on search, category, and visibility permissions
  const filteredProjects = projects.filter(project => {
    // Only show projects that are from the database (real projects)
    const isRealProject = project.is_public !== undefined;
    
    if (!isRealProject) return false;
    
    // Apply search filter
    const searchMatch = !searchQuery || 
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const categoryMatch = !selectedCategory || project.category === selectedCategory;
    
    // Apply visibility filter based on user role
    let visibilityMatch = false;
    
    if (user?.role === 'admin') {
      // Admin sees all real projects
      visibilityMatch = true;
    } else if (user) {
      // User sees public projects or their own projects
      visibilityMatch = project.is_public === true || project.createdBy === user.id;
    } else {
      // Non-authenticated users only see public projects
      visibilityMatch = project.is_public === true;
    }
    
    return searchMatch && categoryMatch && visibilityMatch;
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
