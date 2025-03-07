
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SidebarMenuItem from './SidebarMenuItem';
import { SidebarMenuItemType } from './sidebarMenuConfig';

interface SidebarMenuGroupProps {
  menuItems: SidebarMenuItemType[];
  onCloseMenu?: () => void;
}

const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({ menuItems, onCloseMenu }) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Filter menu items based on user role
  const filteredItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );
  
  if (filteredItems.length === 0) return null;
  
  return (
    <div className="space-y-1">
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
