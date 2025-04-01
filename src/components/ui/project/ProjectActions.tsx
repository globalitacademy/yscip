
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Image, Trash } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';

interface ProjectActionsProps {
  project: ProjectTheme;
  onEdit: (e: React.MouseEvent) => void;
  onImageChange: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  project,
  onEdit,
  onImageChange,
  onDelete
}) => {
  return (
    <div className="absolute top-4 right-4 z-20 flex gap-2">
      <Button
        variant="outline" 
        size="icon" 
        className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
        onClick={onEdit}
      >
        <Pencil size={12} />
      </Button>
      <Button
        variant="outline" 
        size="icon" 
        className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
        onClick={onImageChange}
      >
        <Image size={12} />
      </Button>
      <Button
        variant="outline" 
        size="icon" 
        className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm" 
        onClick={onDelete}
      >
        <Trash size={12} />
      </Button>
    </div>
  );
};

export default ProjectActions;
