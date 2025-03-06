
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserMenu from '@/components/UserMenu';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("border-b border-border sticky top-0 z-50 bg-background", className)}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">ԴիպլոմայինՀաբ</Link>
        
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
