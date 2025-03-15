
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';

interface ProjectEmptyStateProps {
  onAddNewProject?: () => void;
}

const ProjectEmptyState: React.FC<ProjectEmptyStateProps> = ({ onAddNewProject }) => {
  const { user } = useAuth();
  const permissions = useProjectPermissions(user?.role);
  
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">Նախագծեր չեն գտնվել</p>
      {(permissions.canCreateProjects || user?.role === 'student') && onAddNewProject && (
        <Button className="mt-4" onClick={onAddNewProject}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {user?.role === 'student' ? 'Տեսնել հասանելի նախագծերը' : 'Ավելացնել նոր նախագիծ'}
        </Button>
      )}
    </div>
  );
};

export default ProjectEmptyState;
