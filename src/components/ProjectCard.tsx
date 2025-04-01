
import React, { memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { useProjectCard } from '@/hooks/project/useProjectCard';
import ProjectImage from '@/components/ui/project/ProjectImage';
import ProjectBadges from '@/components/ui/project/ProjectBadges';
import ProjectActions from '@/components/ui/project/ProjectActions';
import ProjectTechnologies from '@/components/ui/project/ProjectTechnologies';

interface ProjectCardProps {
  project: ProjectTheme;
  className?: string;
  adminView?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project,
  className,
  adminView = false
}) => {
  const { user } = useAuth();
  
  // Only try to use the context if we're not in admin view
  let projectManagement: any = {};
  try {
    if (!adminView) {
      projectManagement = useProjectManagement();
    }
  } catch (error) {
    // Silently fail if the context is not available
    projectManagement = {
      handleEditInit: () => {},
      handleImageChangeInit: () => {},
      handleDeleteInit: () => {}
    };
  }
  
  const { 
    handleEditInit, 
    handleImageChangeInit, 
    handleDeleteInit 
  } = projectManagement;
  
  const {
    isCreatedByCurrentUser,
    creatorName,
    imageUrl,
    handleEdit,
    handleImageChange,
    handleDelete,
    handleImageError
  } = useProjectCard(
    project, 
    handleEditInit, 
    handleImageChangeInit, 
    handleDeleteInit,
    adminView
  );
  
  return (
    <Card className={`flex flex-col w-full hover:shadow-md transition-shadow relative ${className || ''}`}>
      {!adminView && isCreatedByCurrentUser && (
        <ProjectActions 
          project={project}
          onEdit={handleEdit}
          onImageChange={handleImageChange}
          onDelete={handleDelete}
        />
      )}

      <ProjectBadges 
        category={project.category}
        complexity={project.complexity}
        isPublic={project.is_public}
        adminView={adminView}
        showComplexity={(!adminView && isCreatedByCurrentUser) ? false : true}
      />

      <CardHeader className="pb-2 text-center pt-12 relative">
        <ProjectImage 
          project={project}
          creatorName={creatorName}
          imageUrl={imageUrl}
          handleImageError={handleImageError}
        />
        <h3 className="font-bold text-xl">{project.title}</h3>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <ProjectTechnologies techStack={project.techStack} />
        
        <div className="flex justify-between w-full text-sm mt-auto">
          <span>{project.duration || 'Անորոշ ժամկետ'}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Link to={`/project/${project.id}`} className="w-full">
          <Button 
            variant="outline"
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" /> Մանրամասն
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ProjectCard);
