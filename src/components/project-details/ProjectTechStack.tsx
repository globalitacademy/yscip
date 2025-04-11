
import React from 'react';
import { Calendar, Clock, Tag } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface ProjectTechStackProps {
  duration?: string;
  techStackCount: number;
  organizationName?: string;
}

const ProjectTechStack: React.FC<ProjectTechStackProps> = ({ 
  duration, 
  techStackCount, 
  organizationName 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-wrap gap-4 items-center mt-2">
      {duration && (
        <div className="flex items-center gap-1 text-white/80">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{duration}</span>
        </div>
      )}
      
      <div className="flex items-center gap-1 text-white/80">
        <Tag className="h-4 w-4" />
        <span className="text-sm">{techStackCount} տեխնոլոգիաներ</span>
      </div>
      
      {organizationName && (
        <div className="flex items-center gap-1 text-white/80">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{organizationName}</span>
        </div>
      )}
    </div>
  );
};

export default ProjectTechStack;
