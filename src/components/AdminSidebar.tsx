
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { X, Bell } from 'lucide-react';
import { 
  baseMenuItems, 
  adminMenuItems, 
  lecturerMenuItems, 
  supervisorMenuItems,
  employerMenuItems,
  studentMenuItems 
} from './sidebar/sidebarMenuConfig';
import { loadProjectReservations } from '@/utils/projectUtils';
import { Badge } from '@/components/ui/badge';

interface AdminSidebarProps {
  onCloseMenu?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  onCloseMenu
}) => {
  const {
    user
  } = useAuth();
  
  // Get pending approval count for supervisors
  const getPendingApprovalsCount = () => {
    if (!user || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
      return 0;
    }
    
    const reservations = loadProjectReservations();
    const pendingApprovals = reservations.filter(
      res => res.supervisorId === user.id && res.status === 'pending'
    );
    
    return pendingApprovals.length;
  };
  
  const pendingCount = getPendingApprovalsCount();

  // Early return if user doesn't have appropriate role
  if (!user) {
    return null;
  }
  
  const renderMenuGroup = (groupTitle: string, menuItems: any[]) => (
    <div className="mb-6">
      <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {groupTitle}
      </h3>
      <SidebarMenu>
        {menuItems.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild isActive={window.location.pathname === item.href}>
              <a href={item.href} onClick={onCloseMenu} className="flex items-center">
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
  
  return (
    <Sidebar variant="inset" className="border-r border-border">
      <SidebarHeader className="flex justify-between items-center p-4">
        <div className="text-xl font-bold">Ադմինիստրացիա</div>
        {onCloseMenu && 
          <Button variant="ghost" size="icon" onClick={onCloseMenu} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        }
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        {/* Base menu items (common for all roles) */}
        {baseMenuItems.map((group, index) => {
          const filteredItems = group.items.filter(item => 
            item.roles.includes(user.role)
          );
          
          if (filteredItems.length === 0) return null;
          
          return renderMenuGroup(group.title, filteredItems);
        })}
        
        {/* Pending approvals notification for supervisors */}
        {(user.role === 'supervisor' || user.role === 'project_manager') && pendingCount > 0 && (
          <div className="px-4 py-2 mx-2 mb-2 bg-amber-50 text-amber-800 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="text-sm">Նոր հարցումներ</span>
            </div>
            <Badge variant="secondary" className="bg-amber-200 text-amber-800">
              {pendingCount}
            </Badge>
          </div>
        )}
        
        {/* Role-specific menu items */}
        {user.role === 'admin' && 
          adminMenuItems.map((group, index) => renderMenuGroup(group.title, group.items))
        }
        
        {(user.role === 'lecturer' || user.role === 'instructor' || user.role === 'supervisor' || user.role === 'project_manager') && 
          lecturerMenuItems.map((group, index) => renderMenuGroup(group.title, group.items))
        }
        
        {(user.role === 'supervisor' || user.role === 'project_manager') && 
          supervisorMenuItems.map((group, index) => renderMenuGroup(group.title, group.items))
        }

        {user.role === 'employer' && 
          employerMenuItems.map((group, index) => renderMenuGroup(group.title, group.items))
        }
        
        {user.role === 'student' && 
          studentMenuItems.map((group, index) => renderMenuGroup(group.title, group.items))
        }
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
