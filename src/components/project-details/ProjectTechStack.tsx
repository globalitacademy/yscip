
import React from 'react';
import { Clock, BarChart3, Calendar } from 'lucide-react';

interface ProjectTechStackProps {
  duration?: string;
  techStackCount?: number;
  organizationName?: string;
}

const ProjectTechStack: React.FC<ProjectTechStackProps> = ({
  duration,
  techStackCount,
  organizationName
}) => {
  return (
    <div className="flex flex-wrap gap-4 text-white/80">
      {duration && (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>{duration}</span>
        </div>
      )}
      
      {techStackCount && techStackCount > 0 && (
        <div className="flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          <span>{techStackCount} տեխնոլոգիաներ</span>
        </div>
      )}
      
      {organizationName && (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{organizationName}</span>
        </div>
      )}
    </div>
  );
};

export default ProjectTechStack;
