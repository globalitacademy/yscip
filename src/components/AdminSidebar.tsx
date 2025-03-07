
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import SidebarMenuGroup from './sidebar/SidebarMenuGroup';
import { baseMenuItems, adminMenuItems, lecturerMenuItems, supervisorMenuItems } from './sidebar/sidebarMenuConfig';

interface AdminSidebarProps {
  onCloseMenu?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  onCloseMenu
}) => {
  const { user } = useAuth();

  // Early return if user doesn't have appropriate role
  if (!user || (user.role !== 'admin' && user.role !== 'lecturer' && user.role !== 'supervisor')) {
    return null;
  }

  // Determine which menu items to show based on user role
  const getMenuItems = () => {
    switch (user.role) {
      case 'admin':
        return (
          <>
            <SidebarMenuGroup menuItems={baseMenuItems} onCloseMenu={onCloseMenu} />
            <SidebarMenuGroup menuItems={adminMenuItems} onCloseMenu={onCloseMenu} />
          </>
        );
      case 'lecturer':
        return (
          <>
            <SidebarMenuGroup menuItems={baseMenuItems} onCloseMenu={onCloseMenu} />
            <SidebarMenuGroup menuItems={lecturerMenuItems} onCloseMenu={onCloseMenu} />
          </>
        );
      case 'supervisor':
        return (
          <>
            <SidebarMenuGroup menuItems={baseMenuItems} onCloseMenu={onCloseMenu} />
            <SidebarMenuGroup menuItems={supervisorMenuItems} onCloseMenu={onCloseMenu} />
          </>
        );
      default:
        return null;
    }
  };

  const getSidebarTitle = () => {
    switch (user.role) {
      case 'admin':
        return 'Ադմինիստրացիա';
      case 'lecturer':
        return 'Դասախոսի վահանակ';
      case 'supervisor':
        return 'Ղեկավարի վահանակ';
      default:
        return 'Կառավարման վահանակ';
    }
  };

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto py-6 px-0">
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="text-xl font-bold">{getSidebarTitle()}</div>
        {onCloseMenu && 
          <Button variant="ghost" size="icon" onClick={onCloseMenu} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        }
      </div>
      
      <nav className="space-y-6">
        {getMenuItems()}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
