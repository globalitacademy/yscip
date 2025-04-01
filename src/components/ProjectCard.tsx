import React, { useCallback, memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Building, User, Pencil, Image, Trash } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { getProjectImage } from '@/lib/getProjectImage';

interface ProjectCardProps {
  project: ProjectTheme;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project,
  className,
}) => {
  const { user } = useAuth();
  const { 
    handleEditInit, 
    handleImageChangeInit, 
    handleDeleteInit 
  } = useProjectManagement();
  
  // Check if the project was created by the current user
  const isCreatedByCurrentUser = project.createdBy === user?.id;
  const creatorName = isCreatedByCurrentUser ? 'Ձեր կողմից' : 'Ուսումնական Կենտրոն';
  
  // Use the getProjectImage utility to get a reliable image URL
  const imageUrl = getProjectImage(project);
  
  // Memoize event handlers to prevent unnecessary re-renders
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to project detail
    e.stopPropagation(); // Prevent event bubbling
    handleEditInit(project);
  }, [handleEditInit, project]);

  const handleImageChange = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to project detail
    e.stopPropagation(); // Prevent event bubbling
    handleImageChangeInit(project);
  }, [handleImageChangeInit, project]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to project detail
    e.stopPropagation(); // Prevent event bubbling
    handleDeleteInit(project);
  }, [handleDeleteInit, project]);
  
  return (
    <Card className={`flex flex-col w-full hover:shadow-md transition-shadow relative ${className || ''}`}>
      {isCreatedByCurrentUser && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline" 
            size="icon" 
            className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
            onClick={handleEdit}
          >
            <Pencil size={12} />
          </Button>
          <Button
            variant="outline" 
            size="icon" 
            className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
            onClick={handleImageChange}
          >
            <Image size={12} />
          </Button>
          <Button
            variant="outline" 
            size="icon" 
            className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
            onClick={handleDelete}
          >
            <Trash size={12} />
          </Button>
        </div>
      )}

      <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
        <Building size={12} className="mr-1" />
        <span>{project.category}</span>
      </div>

      {!project.is_public && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full z-10">
          <span>Չհրապարակված</span>
        </div>
      )}

      <CardHeader className="pb-2 text-center pt-12 relative">
        <div className="w-full h-32 mb-4 overflow-hidden rounded-md">
          <img 
            src={imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        <h3 className="font-bold text-xl">{project.title}</h3>
        <p className="text-sm text-muted-foreground">{project.complexity}</p>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <User size={16} />
          <span>Հեղինակ՝ {creatorName}</span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{project.description}</p>
        
        <div className="flex justify-between w-full text-sm mt-auto">
          <span>{project.duration || 'Անորոշ ժամկետ'}</span>
          <span className="font-semibold">
            {project.techStack && project.techStack.length > 0 ? (
              <>
                {project.techStack.slice(0, 2).join(', ')}
                {project.techStack.length > 2 ? '...' : ''}
              </>
            ) : (
              'Տեխնոլոգիաներ չկան'
            )}
          </span>
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
