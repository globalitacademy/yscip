
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
import { useNotifications } from '@/contexts/NotificationContext';
import Logo from './header/Logo';
import NavMenu from './header/NavMenu';
import HeaderActions from './header/HeaderActions';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto">
            <Logo />
            <NavMenu user={user} />
          </div>
          
          <HeaderActions 
            isAuthenticated={isAuthenticated} 
            unreadCount={unreadCount} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
