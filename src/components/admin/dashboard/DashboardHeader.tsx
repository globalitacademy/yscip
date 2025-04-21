
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building, 
  BookOpen, 
  GraduationCap,
  FileText,
  CheckSquare,
  FolderOpen,
  GitPullRequest,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Early return if no user
  if (!user) return null;

  // Show role-specific action buttons
  const renderActionButtons = () => {
    switch (user.role) {
      case 'admin':
        return (
          <>
            <Button variant="outline" onClick={() => navigate('/admin/users')} className="text-xs md:text-sm">
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Օգտատերեր</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/organizations')} className="text-xs md:text-sm">
              <Building className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Կազմակերպություններ</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/courses')} className="text-xs md:text-sm">
              <BookOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Կուրսեր</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/specializations')} className="text-xs md:text-sm">
              <GraduationCap className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Մասնագիտություններ</span>
            </Button>
          </>
        );
      
      case 'lecturer':
      case 'instructor':
      case 'supervisor':
      case 'project_manager':
        return (
          <>
            <Button variant="outline" onClick={() => navigate('/admin/courses')} className="text-xs md:text-sm">
              <BookOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Կուրսեր</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/admin-projects')} className="text-xs md:text-sm">
              <FolderOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Նախագծեր</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/tasks')} className="text-xs md:text-sm">
              <CheckSquare className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Հանձնարարություններ</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/reports')} className="text-xs md:text-sm">
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Հաշվետվություններ</span>
            </Button>
          </>
        );

      case 'employer':
        return (
          <>
            <Button variant="outline" onClick={() => navigate('/admin/projects')} className="text-xs md:text-sm">
              <FolderOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Նախագծեր</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/project-proposals')} className="text-xs md:text-sm">
              <GitPullRequest className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Նախագծերի առաջարկներ</span>
            </Button>
          </>
        );
      
      case 'student':
        return (
          <>
            <Button variant="outline" onClick={() => navigate('/admin/my-projects')} className="text-xs md:text-sm">
              <FolderOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Իմ նախագծերը</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/tasks')} className="text-xs md:text-sm">
              <CheckSquare className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Հանձնարարություններ</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/portfolio')} className="text-xs md:text-sm">
              <Layers className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Պորտֆոլիո</span>
            </Button>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-2">
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default DashboardHeader;
