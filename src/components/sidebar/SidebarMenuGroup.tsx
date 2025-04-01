import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarMenuGroup as SidebarMenuGroupType, SidebarMenuItemType } from './types';
interface SidebarMenuGroupProps {
  menuItems: SidebarMenuGroupType[];
  onCloseMenu?: () => void;
}
const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({
  menuItems,
  onCloseMenu
}) => {
  const {
    user
  } = useAuth();
  if (!user) return null;
  return <>
      {menuItems.map((group, groupIndex) => {
      // Filter menu items by user role
      const filteredItems = group.items.filter(item => item.roles.includes(user.role));
      if (filteredItems.length === 0) return null;
      return <div key={groupIndex} className="mb-6">
            
            <div className="space-y-1 px-[4px]">
              {filteredItems.map((item, index) => <SidebarMenuItem key={index} label={item.title} path={item.href} icon={item.icon} onCloseMenu={onCloseMenu} />)}
            </div>
          </div>;
    })}
    </>;
};
export default SidebarMenuGroup;