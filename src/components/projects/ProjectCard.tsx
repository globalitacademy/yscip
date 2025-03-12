
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Image } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';

interface ProjectCardProps {
  project: ProjectTheme;
  onEdit: (project: ProjectTheme) => void;
  onImageChange: (project: ProjectTheme) => void;
  onDelete: (project: ProjectTheme) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onImageChange, 
  onDelete 
}) => {
  return (
    <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 sm:h-48 bg-gray-100 relative">
        <img 
          src={project.image || 'https://via.placeholder.com/640x360?text=Նախագծի+նկար'} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-white/80 hover:bg-white"
            onClick={() => onImageChange(project)}
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="bg-white/80 hover:bg-red-500 text-red-500 hover:text-white"
            onClick={() => onDelete(project)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="line-clamp-1 text-base sm:text-lg">{project.title}</CardTitle>
        <CardDescription>{project.category}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-3 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.techStack.slice(0, 3).map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.techStack.length - 3}
            </Badge>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onEdit(project)}
          >
            <Edit className="mr-1 h-3 w-3" />
            Խմբագրել
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
