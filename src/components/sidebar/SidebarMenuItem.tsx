
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface SidebarMenuItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ 
  icon, 
  label, 
  path, 
  isActive,
  onClick 
}) => {
  return (
    <Link to={path}>
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full justify-start ${isActive ? "" : "text-muted-foreground"}`}
        onClick={onClick}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );
};

export default SidebarMenuItem;
