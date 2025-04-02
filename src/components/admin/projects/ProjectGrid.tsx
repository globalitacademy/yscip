
import React from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectCard from '@/components/ProjectCard';
import { FadeIn } from '@/components/LocalTransitions';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash, Image } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectGridProps {
  projects: ProjectTheme[];
  onSelectProject: (project: ProjectTheme, action: 'assign' | 'approve') => void;
  onEditProject: (project: ProjectTheme) => void;
  onImageChange: (project: ProjectTheme) => void;
  onDeleteProject: (project: ProjectTheme) => void;
  userRole?: string;
  adminView?: boolean;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  onSelectProject,
  onEditProject,
  onImageChange,
  onDeleteProject,
  userRole,
  adminView
}) => {
  const permissions = useProjectPermissions(userRole);
  const { user } = useAuth();

  // Filter projects based on permissions
  const filteredProjects = projects.filter(project => {
    // First check if it's a real project from database
    const isRealProject = project.is_public !== undefined;
    
    if (!isRealProject) return true; // Allow template projects
    
    // Admin can see all projects
    if (user?.role === 'admin') return true;
    
    // Instructors, lecturers, and employers can see their own projects
    if (user && (user.role === 'instructor' || user.role === 'lecturer' || user.role === 'employer')) {
      return project.createdBy === user.id;
    }
    
    // Other roles only see public projects
    return project.is_public === true;
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Այս կատեգորիայում ծրագրեր չկան</p>
      </div>
    );
  }

  return (
    <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {filteredProjects.map((project) => (
        <div key={`grid-project-${project.id}`} className="relative">
          <ProjectCard
            project={project}
            className="h-full"
            adminView={adminView}
          />
          <div className="absolute top-8 right-4 z-10 flex gap-2">
            <Button
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
              onClick={() => onEditProject(project)}
            >
              <Pencil size={12} />
            </Button>
            <Button
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
              onClick={() => onImageChange(project)}
            >
              <Image size={12} />
            </Button>
            <Button
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
              onClick={() => onDeleteProject(project)}
            >
              <Trash size={12} />
            </Button>
          </div>
        </div>
      ))}
    </FadeIn>
  );
};

export default ProjectGrid;
