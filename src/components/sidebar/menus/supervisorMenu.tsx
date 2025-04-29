
import React from 'react';
import { 
  Users, 
  MousePointerClick,
  CheckSquare,
  FolderGit2,
  BookOpen,
  GraduationCap,
  FileText
} from 'lucide-react';
import { SidebarMenuGroup } from '../types';
import { useTheme } from '@/hooks/use-theme';

export const supervisorMenuItems: SidebarMenuGroup[] = [
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
        title: 'Ուսանողների նախագծեր',
        icon: <FolderGit2 className="h-4 w-4" />,
        href: '/admin/student-projects',
        roles: ['supervisor', 'project_manager']
      },
      {
        title: 'Ծրագրեր',
        icon: <BookOpen className="h-4 w-4" />,
        href: '/admin/programs',
        roles: ['supervisor', 'project_manager']
      },
      {
        title: 'Կուրսեր',
        icon: <GraduationCap className="h-4 w-4" />,
        href: '/admin/courses',
        roles: ['supervisor', 'project_manager']
      },
      {
        title: 'Ուսումնական մոդուլներ',
        icon: <BookOpen className="h-4 w-4" />,
        href: '/admin/educational-modules',
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
      },
      {
        title: 'Ուսանողների առաջադիմություն',
        icon: <FileText className="h-4 w-4" />,
        href: '/admin/student-progress',
        roles: ['supervisor', 'project_manager']
      }
    ]
  }
];
