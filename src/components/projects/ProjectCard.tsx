
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Building, User, Pencil, Image, Trash } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectCardProps {
  project: ProjectTheme;
  className?: string;
  onEdit?: (project: ProjectTheme) => void;
  onImageChange?: (project: ProjectTheme) => void;
  onDelete?: (project: ProjectTheme) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project,
  className,
  onEdit,
  onImageChange,
  onDelete
}) => {
  const { user } = useAuth();
  
  // Check if the project was created by the current user
  const isCreatedByCurrentUser = project.createdBy === user?.id;
  const creatorName = isCreatedByCurrentUser ? 'Ձեր կողմից' : 'Ուսումնական Կենտրոն';
  
  return (
    <Card className={`flex flex-col w-full hover:shadow-md transition-shadow relative ${className || ''}`}>
      {(onEdit || onImageChange || onDelete) && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {onEdit && (
            <Button
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
              onClick={() => onEdit(project)}
            >
              <Pencil size={12} />
            </Button>
          )}
          {onImageChange && (
            <Button
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
              onClick={() => onImageChange(project)}
            >
              <Image size={12} />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
              onClick={() => onDelete(project)}
            >
              <Trash size={12} />
            </Button>
          )}
        </div>
      )}

      <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
        <Building size={12} className="mr-1" />
        <span>{project.category}</span>
      </div>

      <CardHeader className="pb-2 text-center pt-12 relative">
        <div className="w-full h-32 mb-4 overflow-hidden rounded-md">
          <img 
            src={project.image || 'https://via.placeholder.com/640x360?text=Նախագծի+նկար'} 
            alt={project.title}
            className="w-full h-full object-cover"
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

export default ProjectCard;
