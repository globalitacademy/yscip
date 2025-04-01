import React, { useCallback, memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Building, User, Pencil, Image, Trash, Code } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { getProjectImage } from '@/lib/getProjectImage';
import { cn } from '@/lib/utils';

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
  
  // Define complexity color classes
  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case 'Սկսնակ':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Միջին':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Առաջադեմ':
        return 'bg-red-500/10 text-red-600 border-red-200';
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
    }
  };
  
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

      {/* Moved complexity badge to top right */}
      <div className="absolute top-4 right-4 z-10">
        <span className={cn("text-xs border px-2 py-1 rounded-full inline-block", getComplexityColor(project.complexity))}>
          {project.complexity}
        </span>
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
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <User size={16} />
          <span>Հեղինակ՝ {creatorName}</span>
        </div>
        
        {/* Replaced description with Technologies subheading */}
        <div className="mb-4">
          <h4 className="text-sm font-bold mb-2 flex items-center">
            <Code size={16} className="mr-2 text-primary" />
            Տեխնոլոգիաներ
          </h4>
          <div className="flex flex-wrap gap-1">
            {project.techStack && project.techStack.length > 0 ? (
              project.techStack.map((tech, index) => (
                <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {tech}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">Տեխնոլոգիաներ չկան</span>
            )}
          </div>
        </div>
        
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
