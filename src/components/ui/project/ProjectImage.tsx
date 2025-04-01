
import React from 'react';
import { User } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';

interface ProjectImageProps {
  project: ProjectTheme;
  creatorName: string;
  imageUrl: string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const ProjectImage: React.FC<ProjectImageProps> = ({ 
  project, 
  creatorName, 
  imageUrl, 
  handleImageError 
}) => {
  return (
    <div className="w-full h-32 mb-4 overflow-hidden rounded-md relative">
      <img 
        src={imageUrl} 
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        onError={handleImageError}
      />
      
      {/* Author info */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs bg-gray-900/70 text-white px-2 py-1 rounded-full">
        <User size={10} />
        <span>{creatorName}</span>
      </div>
    </div>
  );
};

export default ProjectImage;
