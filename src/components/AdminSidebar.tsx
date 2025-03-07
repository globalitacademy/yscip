
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
  employerMenuItems 
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
  // Ավելացնում ենք "superadmin" դերը այն դերերի ցանկում, որոնք կարող են տեսնել ադմին վահանակը
  if (!user || user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'lecturer' && user.role !== 'instructor' && user.role !== 'project_manager' && user.role !== 'supervisor' && user.role !== 'employer') {
    return null;
  }
  
  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto py-6 px-0">
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="text-xl font-bold">
          {user.role === 'superadmin' ? 'Սուպերադմինիստրացիա' : 'Ադմինիստրացիա'}
        </div>
        {onCloseMenu && <Button variant="ghost" size="icon" onClick={onCloseMenu} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>}
      </div>
      
      <nav className="space-y-6">
        {/* Base menu items (common for all roles) */}
        <SidebarMenuGroup menuItems={baseMenuItems} onCloseMenu={onCloseMenu} />
        
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
        {(user.role === 'admin' || user.role === 'superadmin') && 
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
      </nav>
    </aside>
  );
};

export default AdminSidebar;
