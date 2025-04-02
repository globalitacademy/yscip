import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import DatabaseSyncButton from './DatabaseSyncButton';
import { Square } from 'lucide-react';
import { ThemeToggle } from './ui/theme-toggle';
const Header: React.FC = () => {
  const {
    user,
    isAuthenticated
  } = useAuth();
  return <header className="bg-white shadow-md dark:bg-gray-800 dark:text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 bg-blue-600 flex items-center justify-center rounded">
              <span className="text-white text-sm font-bold">LC</span>
              <Square className="absolute inset-0 w-8 h-8 text-blue-600" strokeWidth={3} />
            </div>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">ԿԿՀ</span>
          </Link>
          
          
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && <DatabaseSyncButton />}
            
            {isAuthenticated ? <UserMenu /> : <div className="space-x-2">
                <Link to="/login" className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Մուտք
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700">
                  Գրանցվել
                </Link>
              </div>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;