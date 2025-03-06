
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

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user } = useAuth();
  const isAdminOrInstructor = user && ['admin', 'supervisor', 'instructor'].includes(user.role);

  return (
    <header className={cn("border-b border-border sticky top-0 z-50 bg-background", className)}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <GraduationCap size={28} className="text-primary" />
            <span className="text-primary">Դիպլոմային</span>
            <span className="text-foreground">Հաբ</span>
          </Link>
          
          {isAdminOrInstructor && (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="gap-1">
                <LayoutDashboard size={16} />
                Կառավարման վահանակ
              </Button>
            </Link>
          )}
        </div>
        
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
