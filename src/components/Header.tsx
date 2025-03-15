
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, GraduationCap } from 'lucide-react';

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
    
    // All roles including students now have the Admin Panel button
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Link to={user.role === 'student' ? '/projects/manage' : '/admin'}>
          <Button variant="outline" size="sm" className="gap-1">
            <LayoutDashboard size={16} />
            <span className="hidden md:inline">
              {user.role === 'student' ? 'Իմ նախագծերը' : 'Ադմին պանել'}
            </span>
          </Button>
        </Link>
        
        {user.role === 'student' && (
          <Link to="/my-projects">
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
          
          {getRoleNavigation()}
        </div>
        
        <UserMenu />
      </div>
    </header>;
};

export default Header;
