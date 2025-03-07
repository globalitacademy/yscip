
import React from 'react';
import {
  LayoutDashboard,
  Users,
  Graduation,
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
  GraduationCap
} from 'lucide-react';
import { SidebarMenuItemProps } from './SidebarMenuItem';

export const baseMenuItems: SidebarMenuItemProps[] = [
  {
    title: 'Դաշտակ',
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: '/admin',
    role: ['admin', 'lecturer', 'instructor', 'supervisor', 'project_manager', 'employer']
  },
  {
    title: 'Ծանուցումներ',
    icon: <Bell className="h-4 w-4" />,
    href: '/notifications',
    role: ['admin', 'lecturer', 'instructor', 'supervisor', 'project_manager', 'employer', 'student']
  }
];

export const adminMenuItems: SidebarMenuItemProps[] = [
  {
    title: 'Օգտագործողներ',
    icon: <Users className="h-4 w-4" />,
    href: '/users',
    role: ['admin']
  },
  {
    title: 'Սպասող հաստատումներ',
    icon: <UserPlus className="h-4 w-4" />,
    href: '/pending-approvals',
    role: ['admin']
  },
  {
    title: 'Մասնագիտացումներ',
    icon: <Book className="h-4 w-4" />,
    href: '/specializations',
    role: ['admin']
  },
  {
    title: 'Կուրսեր',
    icon: <Book className="h-4 w-4" />,
    href: '/courses',
    role: ['admin']
  },
  {
    title: 'Խմբեր',
    icon: <Users className="h-4 w-4" />,
    href: '/groups',
    role: ['admin']
  },
  {
    title: 'Կազմակերպություններ',
    icon: <Building className="h-4 w-4" />,
    href: '/organizations',
    role: ['admin']
  },
  {
    title: 'Հաշվետվություններ',
    icon: <ChartBar className="h-4 w-4" />,
    href: '/reports',
    role: ['admin']
  },
  {
    title: 'Կարգավորումներ',
    icon: <Settings className="h-4 w-4" />,
    href: '/settings',
    role: ['admin']
  }
];

export const lecturerMenuItems: SidebarMenuItemProps[] = [
  {
    title: 'Նախագծեր',
    icon: <Briefcase className="h-4 w-4" />,
    href: '/projects',
    role: ['lecturer', 'instructor', 'supervisor', 'project_manager']
  },
  {
    title: 'Ուսանողներ',
    icon: <Graduation className="h-4 w-4" />,
    href: '/students',
    role: ['lecturer', 'instructor']
  },
  {
    title: 'Առաջադրանքներ',
    icon: <ListChecks className="h-4 w-4" />,
    href: '/tasks',
    role: ['lecturer', 'instructor', 'supervisor', 'project_manager']
  }
];

export const supervisorMenuItems: SidebarMenuItemProps[] = [
  {
    title: 'Ուսանողների ղեկավարում',
    icon: <GraduationCap className="h-4 w-4" />,
    href: '/supervised-students',
    role: ['supervisor', 'project_manager']
  },
  {
    title: 'Պորտֆոլիոներ',
    icon: <Layers className="h-4 w-4" />,
    href: '/portfolios',
    role: ['supervisor', 'project_manager']
  }
];
