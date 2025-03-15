
import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarMenuGroup as SidebarMenuGroupType, SidebarMenuItemType } from './types';

interface SidebarMenuGroupProps {
  menuItems: SidebarMenuGroupType[];
  onCloseMenu?: () => void;
}

const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({ menuItems, onCloseMenu }) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <>
      {menuItems.map((group, groupIndex) => {
        // Filter menu items by user role
        const filteredItems = group.items.filter(item => 
          item.roles.includes(user.role)
        );
        
        if (filteredItems.length === 0) return null;
        
        return (
          <div key={groupIndex} className="mb-6">
            <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.title}
            </h3>
            <div className="space-y-1 px-3">
              {filteredItems.map((item, index) => (
                <SidebarMenuItem
                  key={index}
                  label={item.title}
                  path={item.href}
                  icon={item.icon}
                  onCloseMenu={onCloseMenu}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SidebarMenuGroup;
