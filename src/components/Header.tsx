
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, GraduationCap, BookOpen, ClipboardList, Users, Building, FileText } from 'lucide-react';
interface HeaderProps {
  className?: string;
}
const Header: React.FC<HeaderProps> = ({
  className
}) => {
  const {
    user
  } = useAuth();

  // Define role-based navigation
  const getRoleNavigation = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin':
        return <div className="flex items-center gap-2 md:gap-4">
            <Link to="/admin">
              <Button variant="outline" size="sm" className="gap-1">
                <LayoutDashboard size={16} />
                <span className="hidden md:inline">Ադմին պանել</span>
              </Button>
            </Link>
            <Link to="/users">
              <Button variant="outline" size="sm" className="gap-1">
                <Users size={16} />
                <span className="hidden md:inline">Օգտատերեր</span>
              </Button>
            </Link>
            <Link to="/organizations">
              <Button variant="outline" size="sm" className="gap-1">
                <Building size={16} />
                <span className="hidden md:inline">Կազմակերպություններ</span>
              </Button>
            </Link>
          </div>;
      case 'lecturer':
        return <div className="flex items-center gap-2 md:gap-4">
            <Link to="/tasks">
              <Button variant="outline" size="sm" className="gap-1">
                <ClipboardList size={16} />
                <span className="hidden md:inline">Առաջադրանքներ</span>
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="sm" className="gap-1">
                <BookOpen size={16} />
                <span className="hidden md:inline">Կուրսեր</span>
              </Button>
            </Link>
          </div>;
      case 'project_manager':
        return <div className="flex items-center gap-2 md:gap-4">
            <Link to="/projects/manage">
              <Button variant="outline" size="sm" className="gap-1">
                <LayoutDashboard size={16} />
                <span className="hidden md:inline">Նախագծեր</span>
              </Button>
            </Link>
            <Link to="/gantt">
              <Button variant="outline" size="sm" className="gap-1">
                <ClipboardList size={16} />
                <span className="hidden md:inline">Ժամանակացույց</span>
              </Button>
            </Link>
          </div>;
      case 'employer':
        return <div className="flex items-center gap-2 md:gap-4">
            <Link to="/projects/submit">
              <Button variant="outline" size="sm" className="gap-1">
                <FileText size={16} />
                <span className="hidden md:inline">Նախագծի առաջարկ</span>
              </Button>
            </Link>
            <Link to="/projects/my">
              <Button variant="outline" size="sm" className="gap-1">
                <ClipboardList size={16} />
                <span className="hidden md:inline">Իմ նախագծերը</span>
              </Button>
            </Link>
          </div>;
      case 'student':
        return <div className="flex items-center gap-2 md:gap-4">
            <Link to="/projects">
              <Button variant="outline" size="sm" className="gap-1">
                <ClipboardList size={16} />
                <span className="hidden md:inline">Նախագծեր</span>
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" size="sm" className="gap-1">
                <FileText size={16} />
                <span className="hidden md:inline">Պորտֆոլիո</span>
              </Button>
            </Link>
          </div>;
      default:
        return null;
    }
  };
  return <header className={cn("border-b border-border sticky top-0 z-50 bg-background", className)}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap size={28} className="text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">ՈՒԿՀ</span>
              
            </div>
          </Link>
          
          {getRoleNavigation()}
        </div>
        
        <UserMenu />
      </div>
    </header>;
};
export default Header;
