
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/auth';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  ClipboardList, 
  Users, 
  Building,
  FileText,
  Bell
} from 'lucide-react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  
  // Define role-based navigation
  const getRoleNavigation = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'admin':
        return (
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
            <Link to="/admin">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <LayoutDashboard size={16} />
                <span className="hidden md:inline">Կառավարման վահանակ</span>
              </Button>
            </Link>
            <Link to="/users">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <Users size={16} />
                <span className="hidden md:inline">Օգտատերեր</span>
              </Button>
            </Link>
            <Link to="/organizations">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <Building size={16} />
                <span className="hidden md:inline">Կազմակերպություններ</span>
              </Button>
            </Link>
          </div>
        );
      
      case 'lecturer':
      case 'instructor':
        return (
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
            <Link to="/courses">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <BookOpen size={16} />
                <span className="hidden md:inline">Կուրսեր</span>
              </Button>
            </Link>
            <Link to="/tasks">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <ClipboardList size={16} />
                <span className="hidden md:inline">Առաջադրանքներ</span>
              </Button>
            </Link>
            <Link to="/groups">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <Users size={16} />
                <span className="hidden md:inline">Խմբեր</span>
              </Button>
            </Link>
          </div>
        );
      
      case 'project_manager':
      case 'supervisor':
        return (
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
            <Link to="/projects/manage">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <LayoutDashboard size={16} />
                <span className="hidden md:inline">Նախագծեր</span>
              </Button>
            </Link>
            <Link to="/tasks">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <ClipboardList size={16} />
                <span className="hidden md:inline">Առաջադրանքներ</span>
              </Button>
            </Link>
            <Link to="/gantt">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <FileText size={16} />
                <span className="hidden md:inline">Ժամանակացույց</span>
              </Button>
            </Link>
          </div>
        );
      
      case 'employer':
        return (
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
            <Link to="/projects/my">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <ClipboardList size={16} />
                <span className="hidden md:inline">Իմ նախագծերը</span>
              </Button>
            </Link>
            <Link to="/projects/submit">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <FileText size={16} />
                <span className="hidden md:inline">Նախագծի առաջարկ</span>
              </Button>
            </Link>
          </div>
        );
      
      case 'student':
        return (
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
            <Link to="/projects">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <ClipboardList size={16} />
                <span className="hidden md:inline">Նախագծեր</span>
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                <FileText size={16} />
                <span className="hidden md:inline">Պորտֆոլիո</span>
              </Button>
            </Link>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto">
            <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0">
              <GraduationCap size={28} className="text-primary" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary">Դիպլոմային</span>
                <span className="text-sm text-muted-foreground -mt-1">Նախագծերի կառավարում</span>
              </div>
            </Link>
            
            {getRoleNavigation()}
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {isAuthenticated && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 hover:bg-accent"
                  onClick={() => navigate('/dashboard')}
                >
                  <LayoutDashboard size={16} />
                  <span className="hidden md:inline">Դաշբորդ</span>
                </Button>
                
                <Link to="/notifications" className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-accent"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </>
            )}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
