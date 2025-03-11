
import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarMenuItem from './SidebarMenuItem';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  UsersRound, 
  GraduationCap, 
  Building, 
  Settings, 
  FileBarChart,
  UserCog,
  Briefcase,
  ClipboardList,
  Bell
} from 'lucide-react';

export interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

interface SidebarMenuItemsProps {
  userRole: string;
  onCloseMenu?: () => void;
}

export const getMenuItems = (): MenuItem[] => {
  // Base menu items that appear for all roles
  const baseMenuItems: MenuItem[] = [
    { 
      label: 'Դաշբորդ', 
      path: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'lecturer', 'instructor', 'project_manager', 'supervisor']
    }
  ];
  
  // Admin-specific menu items
  const adminMenuItems: MenuItem[] = [
    { 
      label: 'Օգտատերեր', 
      path: '/users',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      label: 'Կուրսեր', 
      path: '/courses/manage',
      icon: <BookOpen className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      label: 'Խմբեր', 
      path: '/groups',
      icon: <UsersRound className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      label: 'Դասախոսներ', 
      path: '/lecturers',
      icon: <UserCog className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      label: 'Ղեկավարներ', 
      path: '/supervisors',
      icon: <UserCog className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      label: 'Կազմակերպություններ', 
      path: '/organizations',
      icon: <Building className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      label: 'Մասնագիտություններ', 
      path: '/specializations',
      icon: <GraduationCap className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      label: 'Նախագծեր', 
      path: '/projects/manage',
      icon: <Briefcase className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      label: 'Թասքեր', 
      path: '/tasks',
      icon: <ClipboardList className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      label: 'Հաշվետվություններ', 
      path: '/reports',
      icon: <FileBarChart className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      label: 'Ծանուցումներ', 
      path: '/notifications',
      icon: <Bell className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      label: 'Կարգավորումներ', 
      path: '/settings',
      icon: <Settings className="w-5 h-5" />,
      roles: ['admin']
    }
  ];
  
  // Lecturer/instructor menu items
  const lecturerMenuItems: MenuItem[] = [
    { 
      label: 'Կուրսեր', 
      path: '/courses',
      icon: <BookOpen className="w-5 h-5" />,
      roles: ['lecturer', 'instructor']
    },
    { 
      label: 'Խմբեր', 
      path: '/groups',
      icon: <UsersRound className="w-5 h-5" />,
      roles: ['lecturer', 'instructor']
    },
    { 
      label: 'Թասքեր', 
      path: '/tasks',
      icon: <ClipboardList className="w-5 h-5" />,
      roles: ['lecturer', 'instructor']
    }
  ];
  
  // Project manager/supervisor menu items
  const supervisorMenuItems: MenuItem[] = [
    { 
      label: 'Նախագծեր', 
      path: '/projects/manage',
      icon: <Briefcase className="w-5 h-5" />,
      roles: ['project_manager', 'supervisor']
    },
    { 
      label: 'Ուսանողներ', 
      path: '/supervised-students',
      icon: <UsersRound className="w-5 h-5" />,
      roles: ['project_manager', 'supervisor']
    },
    { 
      label: 'Թասքեր', 
      path: '/tasks',
      icon: <ClipboardList className="w-5 h-5" />,
      roles: ['project_manager', 'supervisor']
    }
  ];
  
  return [...baseMenuItems, ...adminMenuItems, ...lecturerMenuItems, ...supervisorMenuItems];
};

const SidebarMenuItems: React.FC<SidebarMenuItemsProps> = ({ userRole, onCloseMenu }) => {
  const location = useLocation();
  const allMenuItems = getMenuItems();
  
  // Filter items by user role
  const filteredItems = allMenuItems.filter(item => item.roles.includes(userRole));
  
  return (
    <nav className="space-y-1">
      {filteredItems.map((item, index) => (
        <SidebarMenuItem
          key={index}
          icon={item.icon}
          label={item.label}
          path={item.path}
          isActive={location.pathname === item.path}
          onClick={onCloseMenu}
        />
      ))}
    </nav>
  );
};

export default SidebarMenuItems;
