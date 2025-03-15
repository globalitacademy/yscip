import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ListChecks,
  FileText,
  Book,
  Settings,
  Bell,
  Briefcase,
  Building,
  ChartBar,
  Layers,
  List,
  UserPlus,
  ClipboardList,
  Upload
} from 'lucide-react';

// Define the type for menu items
export interface SidebarMenuItemType {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

export const baseMenuItems: SidebarMenuItemType[] = [
  {
    label: 'Ադմին պանել',
    path: '/admin',
    icon: <LayoutDashboard className="h-4 w-4" />,
    roles: ['admin', 'lecturer', 'instructor', 'supervisor', 'project_manager', 'employer']
  },
  {
    label: 'Ծանուցումներ',
    path: '/notifications',
    icon: <Bell className="h-4 w-4" />,
    roles: ['admin', 'lecturer', 'instructor', 'supervisor', 'project_manager', 'employer', 'student']
  }
];

export const adminMenuItems: SidebarMenuItemType[] = [
  {
    label: 'Օգտագործողներ',
    path: '/users',
    icon: <Users className="h-4 w-4" />,
    roles: ['admin']
  },
  {
    label: 'Սպասող հաստատումներ',
    path: '/pending-approvals',
    icon: <UserPlus className="h-4 w-4" />,
    roles: ['admin']
  },
  {
    label: 'Մասնագիտացումներ',
    path: '/specializations',
    icon: <Book className="h-4 w-4" />,
    roles: ['admin']
  },
  {
    label: 'Կուրսեր',
    path: '/courses',
    icon: <Book className="h-4 w-4" />,
    roles: ['admin']
  },
  {
    label: 'Խմբեր',
    path: '/groups',
    icon: <Users className="h-4 w-4" />,
    roles: ['admin']
  },
  {
    label: 'Կազմակերպություններ',
    path: '/organizations',
    icon: <Building className="h-4 w-4" />,
    roles: ['admin']
  },
  {
    label: 'Հաշվետվություններ',
    path: '/reports',
    icon: <ChartBar className="h-4 w-4" />,
    roles: ['admin']
  },
  {
    label: 'Կարգավորումներ',
    path: '/settings',
    icon: <Settings className="h-4 w-4" />,
    roles: ['admin']
  }
];

export const lecturerMenuItems: SidebarMenuItemType[] = [
  {
    label: 'Նախագծեր',
    path: '/projects',
    icon: <Briefcase className="h-4 w-4" />,
    roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
  },
  {
    label: 'Ուսանողներ',
    path: '/students',
    icon: <GraduationCap className="h-4 w-4" />,
    roles: ['lecturer', 'instructor']
  },
  {
    label: 'Առաջադրանքներ',
    path: '/tasks',
    icon: <ListChecks className="h-4 w-4" />,
    roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
  }
];

export const supervisorMenuItems: SidebarMenuItemType[] = [
  {
    label: 'Ուսանողների ղեկավարում',
    path: '/supervised-students',
    icon: <GraduationCap className="h-4 w-4" />,
    roles: ['supervisor', 'project_manager']
  },
  {
    label: 'Պորտֆոլիոներ',
    path: '/portfolios',
    icon: <Layers className="h-4 w-4" />,
    roles: ['supervisor', 'project_manager']
  }
];

export const employerMenuItems: SidebarMenuItemType[] = [
  {
    label: 'Նախագծերի առաջարկներ',
    path: '/project-proposals',
    icon: <FileText className="h-4 w-4" />,
    roles: ['employer']
  },
  {
    label: 'Իմ նախագծերը',
    path: '/my-projects',
    icon: <Briefcase className="h-4 w-4" />,
    roles: ['employer']
  }
];

export const studentMenuItems: SidebarMenuItemType[] = [
  {
    label: 'Իմ նախագծերը',
    path: '/my-projects',
    icon: <Briefcase className="h-4 w-4" />,
    roles: ['student']
  },
  {
    label: 'Նախագծի ներկայացում',
    path: '/projects/manage',
    icon: <Upload className="h-4 w-4" />,
    roles: ['student']
  },
  {
    label: 'Առաջադրանքներ',
    path: '/tasks',
    icon: <ListChecks className="h-4 w-4" />,
    roles: ['student']
  },
  {
    label: 'Պոрտֆոլիո',
    path: '/portfolios',
    icon: <Layers className="h-4 w-4" />,
    roles: ['student']
  }
];
