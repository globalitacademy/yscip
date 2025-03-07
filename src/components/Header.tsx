
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, GraduationCap, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user } = useAuth();
  const isAdminOrInstructor = user && ['admin', 'supervisor', 'instructor'].includes(user.role);

  return (
    <header className={cn("border-b border-border sticky top-0 z-50 bg-background", className)}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/" className="flex items-center gap-1 sm:gap-2">
            <GraduationCap size={24} className="text-primary sm:size-28" />
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold text-primary">Դիպլոմային</span>
              <span className="text-xs sm:text-sm text-muted-foreground -mt-1">Նախագծերի կառավարում</span>
            </div>
          </Link>
          
          {/* Desktop view for admin button */}
          {isAdminOrInstructor && (
            <div className="hidden sm:block">
              <Link to="/admin">
                <Button variant="outline" size="sm" className="gap-1">
                  <LayoutDashboard size={16} />
                  Կառավարման վահանակ
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile navigation */}
        <div className="flex items-center gap-2 sm:hidden">
          {isAdminOrInstructor && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[360px]">
                <div className="py-6 space-y-4">
                  <Link to="/admin" className="block">
                    <Button variant="outline" size="sm" className="w-full gap-1 justify-start">
                      <LayoutDashboard size={16} />
                      Կառավարման վահանակ
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <UserMenu />
        </div>
        
        {/* Desktop user menu */}
        <div className="hidden sm:block">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
