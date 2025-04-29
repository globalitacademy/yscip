
import React from 'react';
import { 
  GraduationCap, 
  Book, 
  School, 
  BookOpen,
  CheckSquare 
} from 'lucide-react';
import { SidebarMenuGroup } from '../types';

export const lecturerMenuItems: SidebarMenuGroup[] = [
  {
    title: 'Դասավանդում',
    items: [
      {
        title: 'Ուսանողների նախագծեր',
        icon: <GraduationCap className="h-4 w-4" />,
        href: '/admin/lecturer-student-projects',
        roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
      },
      {
        title: 'Ծրագրեր',
        icon: <Book className="h-4 w-4" />,
        href: '/admin/lecturer-programs',
        roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
      },
      {
        title: 'Կուրսեր',
        icon: <School className="h-4 w-4" />,
        href: '/admin/lecturer-courses',
        roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
      },
      {
        title: 'Ուսումնական մոդուլներ',
        icon: <BookOpen className="h-4 w-4" />,
        href: '/admin/lecturer-educational-modules',
        roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
      },
      {
        title: 'Հանձնարարություններ',
        icon: <CheckSquare className="h-4 w-4" />,
        href: '/admin/lecturer-tasks',
        roles: ['lecturer', 'instructor', 'supervisor', 'project_manager']
      }
    ]
  }
];
