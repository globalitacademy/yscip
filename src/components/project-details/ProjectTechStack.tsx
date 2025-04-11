
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building, Clock } from 'lucide-react';

interface ProjectTechStackProps {
  duration?: string;
  techStackCount?: number;
  organizationName?: string;
}

const ProjectTechStack: React.FC<ProjectTechStackProps> = ({
  duration,
  techStackCount = 0,
  organizationName
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
      {duration && (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{duration}</span>
        </div>
      )}
      
      {techStackCount > 0 && (
        <Badge variant="outline" className="text-white border-white/30 bg-white/10">
          {techStackCount} տեխնոլոգիա
        </Badge>
      )}
      
      {organizationName && (
        <div className="flex items-center gap-1.5">
          <Building className="h-3.5 w-3.5" />
          <span>{organizationName}</span>
        </div>
      )}
    </div>
  );
};

export default ProjectTechStack;
