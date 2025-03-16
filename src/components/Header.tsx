
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, GraduationCap, BookOpen, Code } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
    
    // Determine correct dashboard route based on user role
    const getDashboardRoute = () => {
      if (user.role === 'student') {
        return '/admin/my-projects';
      } else {
        return '/admin/dashboard';
      }
    };

    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Link to={getDashboardRoute()}>
          <Button variant="outline" size="sm" className="gap-1">
            <LayoutDashboard size={16} />
            <span className="hidden md:inline">
              {user.role === 'student' ? 'Իմ նախագծերը' : 'Ադմին պանել'}
            </span>
          </Button>
        </Link>
        
        {user.role === 'student' && (
          <Link to="/admin/student-projects">
            <Button variant="outline" size="sm" className="gap-1">
              <GraduationCap size={16} />
              <span className="hidden md:inline">Նախագծեր</span>
            </Button>
          </Link>
        )}
      </div>
    );
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
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/admin/student-projects">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Code className="mr-2 h-4 w-4" />
                    Նախագծեր
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/admin/courses">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Դասընթացներ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {getRoleNavigation()}
        </div>
        
        <UserMenu />
      </div>
    </header>;
};

export default Header;
