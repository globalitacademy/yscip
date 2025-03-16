
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectCard from '@/components/projects/ProjectCard';
import { FadeIn } from '@/components/LocalTransitions';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';

interface ProjectGridProps {
  projects: ProjectTheme[];
  onSelectProject: (project: ProjectTheme, action: 'assign' | 'approve') => void;
  onEditProject: (project: ProjectTheme) => void;
  onImageChange: (project: ProjectTheme) => void;
  onDeleteProject: (project: ProjectTheme) => void;
  userRole?: string;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  onSelectProject,
  onEditProject,
  onImageChange,
  onDeleteProject,
  userRole
}) => {
  const permissions = useProjectPermissions(userRole);

  if (projects.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Այս կատեգորիայում ծրագրեր չկան</p>
      </div>
    );
  }

  return (
    <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {projects.map((project) => (
        <div key={project.id} className="relative">
          <ProjectCard
            project={project}
            onEdit={onEditProject}
            onImageChange={onImageChange}
            onDelete={onDeleteProject}
          />
          
          {/* Action buttons overlay */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {permissions.canAssignProjects && (
              <Button 
                size="sm" 
                variant="outline"
                className="bg-background/80 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProject(project, 'assign');
                }}
              >
                Նշանակել
              </Button>
            )}
            
            {permissions.canApproveProject && (
              <Button 
                size="sm" 
                variant="outline"
                className="bg-background/80 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProject(project, 'approve');
                }}
              >
                Հաստատել
              </Button>
            )}
          </div>
        </div>
      ))}
    </FadeIn>
  );
};

export default ProjectGrid;
