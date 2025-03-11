
import React from 'react';
import { useAuth } from '@/contexts/auth';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarMenuItems from './sidebar/SidebarMenuItems';

interface AdminSidebarProps {
  onCloseMenu?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMenu }) => {
  const { user } = useAuth();
  
  // Check if user has appropriate role to access admin sidebar
  const adminRoles = ['admin', 'lecturer', 'instructor', 'project_manager', 'supervisor'];
  if (!user || !adminRoles.includes(user.role)) {
    return null;
  }
  
  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto px-4 py-6">
      <SidebarHeader 
        title="Ադմինիստրացիա" 
        onCloseMenu={onCloseMenu} 
      />
      
      <SidebarMenuItems 
        userRole={user.role} 
        onCloseMenu={onCloseMenu} 
      />
    </aside>
  );
};

export default AdminSidebar;
