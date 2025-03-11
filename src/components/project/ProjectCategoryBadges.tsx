
import React from 'react';
import { Tag, GraduationCap, BookOpen, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { DBUser } from '@/types/database.types';

interface ProjectCategoryBadgesProps {
  projectCount: number;
  user: DBUser | null;
  reservedProjectsCount?: number;
}

const ProjectCategoryBadges: React.FC<ProjectCategoryBadgesProps> = ({ 
  projectCount, 
  user, 
  reservedProjectsCount 
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline" className="bg-muted flex items-center gap-1">
        <Tag size={14} />
        {projectCount} նախագիծ
      </Badge>
      
      {user && (
        <Badge variant="outline" className="bg-primary/10 text-primary flex items-center gap-1">
          {user.role === 'student' ? (
            <>
              <GraduationCap size={14} />
              Ուսանող {user.course && user.group ? `(${user.course}-րդ կուրս, ${user.group})` : ''}
            </>
          ) : user.role === 'instructor' ? (
            <>
              <BookOpen size={14} />
              Դասախոս
            </>
          ) : user.role === 'supervisor' ? (
            <>
              <Users size={14} />
              Ղեկավար
            </>
          ) : (
            'Ադմինիստրատոր'
          )}
        </Badge>
      )}
      
      {user && user.role === 'student' && reservedProjectsCount !== undefined && (
        <Badge variant="secondary">
          {reservedProjectsCount} ամրագրված նախագիծ
        </Badge>
      )}
    </div>
  );
};

export default ProjectCategoryBadges;
