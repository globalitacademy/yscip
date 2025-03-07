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
  const {
    user
  } = useAuth();

  // Early return if user doesn't have appropriate role
  if (!user || user.role !== 'admin' && user.role !== 'lecturer' && user.role !== 'instructor' && user.role !== 'project_manager' && user.role !== 'supervisor') {
    return null;
  }
  return <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto py-6 px-0">
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="text-xl font-bold">Ադմինիստրացիա</div>
        {onCloseMenu && <Button variant="ghost" size="icon" onClick={onCloseMenu} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>}
      </div>
      
      <nav className="space-y-6">
        {/* Base menu items (common for all roles) */}
        <SidebarMenuGroup menuItems={baseMenuItems} onCloseMenu={onCloseMenu} />
        
        {/* Role-specific menu items */}
        <SidebarMenuGroup menuItems={adminMenuItems} onCloseMenu={onCloseMenu} />
        <SidebarMenuGroup menuItems={lecturerMenuItems} onCloseMenu={onCloseMenu} />
        <SidebarMenuGroup menuItems={supervisorMenuItems} onCloseMenu={onCloseMenu} />
      </nav>
    </aside>;
};
export default AdminSidebar;