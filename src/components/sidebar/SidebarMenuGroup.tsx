
import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarMenuItemType } from './sidebarMenuConfig';

interface SidebarMenuGroupProps {
  menuItems: SidebarMenuItemType[];
  onCloseMenu?: () => void;
}

const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({ menuItems, onCloseMenu }) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Filter menu items by user role
  const filteredItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );
  
  if (filteredItems.length === 0) return null;
  
  return (
    <div className="space-y-1 px-3">
      {filteredItems.map((item, index) => (
        <SidebarMenuItem
          key={index}
          label={item.label}
          path={item.path}
          icon={item.icon}
          onCloseMenu={onCloseMenu}
        />
      ))}
    </div>
  );
};

export default SidebarMenuGroup;
