
import React from 'react';
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
  Bell,
  UserCheck
} from 'lucide-react';

// Define menu item type
export interface SidebarMenuItemType {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

// Base menu items
export const baseMenuItems: SidebarMenuItemType[] = [
  { 
    label: 'Դաշբորդ', 
    path: '/admin',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['admin', 'lecturer', 'instructor', 'project_manager', 'supervisor']
  }
];

// Admin-specific menu items
export const adminMenuItems: SidebarMenuItemType[] = [
  { 
    label: 'Օգտատերեր', 
    path: '/users',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin']
  },
  { 
    label: 'Օգտատերերի հաստատում', 
    path: '/pending-approvals',
    icon: <UserCheck className="w-5 h-5" />,
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
    label: 'Հաշվետվություններ', 
    path: '/reports',
    icon: <FileBarChart className="w-5 h-5" />,
    roles: ['admin']
  },
  { 
    label: 'Կարգավորումներ', 
    path: '/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['admin']
  }
];

// Lecturer-specific menu items
export const lecturerMenuItems: SidebarMenuItemType[] = [
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

// Supervisor-specific menu items
export const supervisorMenuItems: SidebarMenuItemType[] = [
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
