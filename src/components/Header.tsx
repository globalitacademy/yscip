
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, LayoutDashboard, GraduationCap } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import { useNotifications } from '@/hooks/useNotifications';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  className
}) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
          
          {getRoleNavigation()}
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
              
              {notificationsOpen && (
                <NotificationsDropdown onClose={() => setNotificationsOpen(false)} />
              )}
            </div>
          )}
          <UserMenu />
        </div>
      </div>
    </header>;
};

export default Header;
