
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
    <Link to={path}>
      <Button 
        variant={isActive ? "default" : "ghost"} 
        className={`w-full justify-start ${isActive ? "" : "text-muted-foreground"} transition-colors duration-200 hover:bg-secondary/20`} 
        onClick={onCloseMenu}
      >
        {icon}
        <span className="ml-2 mx-[6px] font-medium transition-colors duration-200 group-hover:text-primary">{label}</span>
      </Button>
    </Link>
  );
};

export default SidebarMenuItem;
