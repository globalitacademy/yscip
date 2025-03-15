
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { X, Bell } from 'lucide-react';
import SidebarMenuGroup from './sidebar/SidebarMenuGroup';
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
  
  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto py-6 px-0 transition-all duration-300 shadow-sm">
      <div className="flex justify-between items-center mb-8 px-4">
        <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Ադմինիստրացիա</div>
        {onCloseMenu && <Button variant="ghost" size="icon" onClick={onCloseMenu} className="md:hidden hover:bg-secondary/20">
            <X className="h-5 w-5" />
          </Button>}
      </div>
      
      <nav className="space-y-6">
        {/* Base menu items (common for all roles) */}
        <SidebarMenuGroup menuItems={baseMenuItems} onCloseMenu={onCloseMenu} />
        
        {/* Pending approvals notification for supervisors */}
        {(user.role === 'supervisor' || user.role === 'project_manager') && pendingCount > 0 && (
          <div className="px-4 py-2 mx-3 mb-2 bg-amber-50 text-amber-800 rounded-md flex items-center justify-between transition-all duration-300 hover:bg-amber-100">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">Նոր հարցումներ</span>
            </div>
            <Badge variant="secondary" className="bg-amber-200 text-amber-800">
              {pendingCount}
            </Badge>
          </div>
        )}
        
        {/* Role-specific menu items */}
        {user.role === 'admin' && 
          <SidebarMenuGroup menuItems={adminMenuItems} onCloseMenu={onCloseMenu} />
        }
        
        {(user.role === 'lecturer' || user.role === 'instructor' || user.role === 'supervisor' || user.role === 'project_manager') && 
          <SidebarMenuGroup menuItems={lecturerMenuItems} onCloseMenu={onCloseMenu} />
        }
        
        {(user.role === 'supervisor' || user.role === 'project_manager') && 
          <SidebarMenuGroup menuItems={supervisorMenuItems} onCloseMenu={onCloseMenu} />
        }

        {user.role === 'employer' && 
          <SidebarMenuGroup menuItems={employerMenuItems} onCloseMenu={onCloseMenu} />
        }
        
        {user.role === 'student' && 
          <SidebarMenuGroup menuItems={studentMenuItems} onCloseMenu={onCloseMenu} />
        }
      </nav>
    </aside>
  );
};

export default AdminSidebar;
