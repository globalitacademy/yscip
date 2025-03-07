import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
interface SidebarMenuItemProps {
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
  return <Link to={path}>
      <Button variant={isActive ? "default" : "ghost"} className={`w-full justify-start ${isActive ? "" : "text-muted-foreground"}`} onClick={onCloseMenu}>
        {icon}
        <span className="ml-2 mx-[6px]">{label}</span>
      </Button>
    </Link>;
};
export default SidebarMenuItem;