
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

export const baseMenuItems = [
  {
    title: 'Ընդհանուր',
    items: [
      {
        title: 'Կառավարման վահանակ',
        icon: <LayoutDashboard className="h-4 w-4" />,
        href: '/admin/dashboard'
      },
      {
        title: 'Ծանուցումներ',
        icon: <Bell className="h-4 w-4" />,
        href: '/admin/notifications'
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
        href: '/admin/users'
      },
      {
        title: 'Ծրագրեր',
        icon: <Folders className="h-4 w-4" />,
        href: '/admin/projects'
      },
      {
        title: 'Մասնագիտացումներ',
        icon: <Trophy className="h-4 w-4" />,
        href: '/admin/specializations'
      },
      {
        title: 'Խմբեր',
        icon: <Users className="h-4 w-4" />,
        href: '/admin/groups'
      },
      {
        title: 'Կազմակերպություններ',
        icon: <Building className="h-4 w-4" />,
        href: '/admin/organizations'
      },
      {
        title: 'Հաշվետվություններ',
        icon: <FileText className="h-4 w-4" />,
        href: '/admin/reports'
      },
      {
        title: 'Կուրսեր',
        icon: <School className="h-4 w-4" />,
        href: '/admin/courses'
      },
      {
        title: 'Ուսումնական մոդուլներ',
        icon: <BookOpen className="h-4 w-4" />,
        href: '/admin/modules'
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
        href: '/admin/student-projects'
      },
      {
        title: 'Ծրագրեր',
        icon: <Book className="h-4 w-4" />,
        href: '/admin/projects'
      },
      {
        title: 'Կուրսեր',
        icon: <School className="h-4 w-4" />,
        href: '/admin/courses'
      },
      {
        title: 'Ուսումնական մոդուլներ',
        icon: <BookOpen className="h-4 w-4" />,
        href: '/admin/modules'
      },
      {
        title: 'Հանձնարարություններ',
        icon: <CheckSquare className="h-4 w-4" />,
        href: '/admin/tasks'
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
        href: '/admin/supervised-students'
      },
      {
        title: 'Թեմաների հարցումներ',
        icon: <MousePointerClick className="h-4 w-4" />,
        href: '/admin/pending-approvals'
      },
      {
        title: 'Հանձնարարություններ',
        icon: <CheckSquare className="h-4 w-4" />,
        href: '/admin/tasks'
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
        href: '/admin/projects'
      },
      {
        title: 'Նախագծերի առաջարկներ',
        icon: <GitPullRequest className="h-4 w-4" />,
        href: '/admin/project-proposals'
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
        href: '/admin/my-projects'
      },
      {
        title: 'Հանձնարարություններ',
        icon: <CheckSquare className="h-4 w-4" />,
        href: '/admin/tasks'
      },
      {
        title: 'Պորտֆոլիո',
        icon: <Layers className="h-4 w-4" />,
        href: '/admin/portfolio'
      }
    ]
  }
];
