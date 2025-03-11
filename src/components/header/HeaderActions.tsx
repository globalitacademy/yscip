
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UserMenu from '@/components/UserMenu';

interface HeaderActionsProps {
  isAuthenticated: boolean;
  unreadCount: number;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ isAuthenticated, unreadCount }) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default HeaderActions;
