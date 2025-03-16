
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag, Users, GraduationCap, BookOpen } from 'lucide-react';
import { User } from '@/types/user';

interface UserBadgesProps {
  user: User | null;
  projectCount: number;
}

const UserBadges: React.FC<UserBadgesProps> = ({ user, projectCount }) => {
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
              Ուսանող
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
    </div>
  );
};

export default UserBadges;
