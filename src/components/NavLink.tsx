
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center h-9 px-3 rounded-md text-sm font-medium transition-colors",
        isActive 
          ? "bg-accent text-accent-foreground" 
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
    >
      {icon}
      <span className="ml-2 mx-[6px]">{label}</span>
    </Link>
  );
};
