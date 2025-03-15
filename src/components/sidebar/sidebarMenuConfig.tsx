
import React from 'react';
import {
  LayoutDashboard,
  Users,
  Folders,
  Book,
  Layers,
  MousePointerClick,
  GraduationCap,
  Settings,
  Bell,
  Building,
  FileText,
  Briefcase,
  CheckSquare,
  GitPullRequest,
  BarChart,
  Trophy,
  School,
  BookOpen
} from 'lucide-react';

export interface SidebarMenuItemType {
  title: string;
  icon: React.ReactNode;
  href: string;
  label?: string;
  path?: string;
  roles: string[];
}

export const baseMenuItems = [
  {
    title: 'Ընդհանուր',
    items: [
      {
        title: 'Կառավարման վահանակ',
        icon: <LayoutDashboard className="h-4 w-4" />,
        href: '/admin/dashboard',
        roles: ['admin', 'supervisor', 'lecturer', 'instructor', 'project_manager', 'employer', 'student']
      },
      {
        title: 'Ծանուցումներ',
        icon: <Bell className="h-4 w-4" />,
        href: '/admin/notifications',
        roles: ['admin', 'supervisor', 'lecturer', 'instructor', 'project_manager', 'employer', 'student']
      }
    ]
  }
];

export const adminMenuItems = [
  {
    title: 'Կառավարում',
    items: [
      {
        title: 'Օգտատերեր',
        icon: <Users className="h-4 w-4" />,
        href: '/admin/users',
        roles: ['admin']
      },
      {
        title: 'Ծրագրեր',
        icon: <Folders className="h-4 w-4" />,
        href: '/admin/projects',
        roles: ['admin']
      },
      {
        title: 'Մասնագիտացումներ',
        icon: <Trophy className="h-4 w-4" />,
        href: '/admin/specializations',
        roles: ['admin']
      },
      {
        title: 'Խմբեր',
        icon: <Users className="h-4 w-4" />,
        href: '/admin/groups',
        roles: ['admin']
      },
      {
        title: 'Կազմակերպություններ',
        icon: <Building className="h-4 w-4" />,
        href: '/admin/organizations',
        roles: ['admin']
      },
      {
        title: 'Հաշվետվություններ',
        icon: <FileText className="h-4 w-4" />,
        href: '/admin/reports',
        roles: ['admin']
      },
      {
        title: 'Կուրսեր',
        icon: <School className="h-4 w-4" />,
        href: '/admin/courses',
        roles: ['admin']
      },
      {
        title: 'Ուսումնական մոդուլներ',
        icon: <BookOpen className="h-4 w-4" />,
        href: '/admin/modules',
        roles: ['admin']
      }
    ]
  }
];

export const lecturerMenuItems = [
  {
    title: 'Դասավանդում',
    items: [
      {
        title: 'Ուսանողների նախագծեր',
        icon: <GraduationCap className="h-4 w-4" />,
        href: '/admin/student-projects',
        roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
      },
      {
        title: 'Ծրագրեր',
        icon: <Book className="h-4 w-4" />,
        href: '/admin/projects',
        roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
      },
      {
        title: 'Կուրսեր',
        icon: <School className="h-4 w-4" />,
        href: '/admin/courses',
        roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
      },
      {
        title: 'Ուսումնական մոդուլներ',
        icon: <BookOpen className="h-4 w-4" />,
        href: '/admin/modules',
        roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
      },
      {
        title: 'Հանձնարարություններ',
        icon: <CheckSquare className="h-4 w-4" />,
        href: '/admin/tasks',
        roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
      }
    ]
  }
];

export const supervisorMenuItems = [
  {
    title: 'Ղեկավարություն',
    items: [
      {
        title: 'Ղեկավարվող ուսանողներ',
        icon: <Users className="h-4 w-4" />,
        href: '/admin/supervised-students',
        roles: ['supervisor', 'project_manager']
      },
      {
        title: 'Թեմաների հարցումներ',
        icon: <MousePointerClick className="h-4 w-4" />,
        href: '/admin/pending-approvals',
        roles: ['supervisor', 'project_manager']
      },
      {
        title: 'Հանձնարարություններ',
        icon: <CheckSquare className="h-4 w-4" />,
        href: '/admin/tasks',
        roles: ['supervisor', 'project_manager']
      }
    ]
  }
];

export const employerMenuItems = [
  {
    title: 'Գործատու',
    items: [
      {
        title: 'Նախագծեր',
        icon: <Briefcase className="h-4 w-4" />,
        href: '/admin/projects',
        roles: ['employer']
      },
      {
        title: 'Նախագծերի առաջարկներ',
        icon: <GitPullRequest className="h-4 w-4" />,
        href: '/admin/project-proposals',
        roles: ['employer']
      }
    ]
  }
];

export const studentMenuItems = [
  {
    title: 'Ուսանող',
    items: [
      {
        title: 'Իմ նախագծերը',
        icon: <Folders className="h-4 w-4" />,
        href: '/admin/my-projects',
        roles: ['student']
      },
      {
        title: 'Հանձնարարություններ',
        icon: <CheckSquare className="h-4 w-4" />,
        href: '/admin/tasks',
        roles: ['student']
      },
      {
        title: 'Պորտֆոլիո',
        icon: <Layers className="h-4 w-4" />,
        href: '/admin/portfolio',
        roles: ['student']
      }
    ]
  }
];
