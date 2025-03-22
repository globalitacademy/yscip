
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import DatabaseSyncButton from './DatabaseSyncButton';
import { Square } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 bg-blue-600 flex items-center justify-center rounded">
                <span className="text-white text-sm font-bold">LC</span>
                <Square className="absolute inset-0 w-8 h-8 text-blue-600" strokeWidth={3} />
              </div>
              <span className="text-xl font-bold text-blue-600">ԿԿՀ</span>
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Գլխավոր</Link>
              <Link to="/projects" className="text-gray-600 hover:text-gray-900">Նախագծեր</Link>
              <Link to="/courses" className="text-gray-600 hover:text-gray-900">Դասընթացներ</Link>
              {isAuthenticated && (
                <Link to="/portfolio" className="text-gray-600 hover:text-gray-900">Պորտֆոլիո</Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <DatabaseSyncButton />
            )}
            
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Մուտք
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
                >
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
