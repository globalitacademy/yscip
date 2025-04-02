
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import DatabaseSyncButton from './DatabaseSyncButton';
import { LayoutDashboard, Square } from 'lucide-react';
import { ThemeToggle } from './ui/theme-toggle';

const Header: React.FC = () => {
  const {
    user,
    isAuthenticated
  } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 bg-primary flex items-center justify-center rounded">
              <span className="text-primary-foreground text-sm font-bold">LC</span>
              <Square className="absolute inset-0 w-8 h-8 text-primary" strokeWidth={3} />
            </div>
            <span className="text-xl font-bold text-primary">ԿԿՀ</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && <DatabaseSyncButton />}
            
            <ThemeToggle />
            
            {isAdmin && (
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent/80"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">Կառավարում</span>
              </Link>
            )}
            
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="px-4 py-2 border border-border rounded text-foreground hover:bg-accent hover:text-accent-foreground">
                  Մուտք
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary rounded text-primary-foreground hover:bg-primary/90">
                  Գրանցվել
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
