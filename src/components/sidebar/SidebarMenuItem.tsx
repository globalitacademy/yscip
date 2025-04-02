
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export interface SidebarMenuItemProps {
  label: string;
  path: string;
  icon: React.ReactNode;
  onCloseMenu?: () => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  label,
  path,
  icon,
  onCloseMenu
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Link to={path} onClick={onCloseMenu}>
      <Button 
        variant={isActive ? "default" : "ghost"} 
        className={`w-full justify-start ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );
};

export default SidebarMenuItem;
