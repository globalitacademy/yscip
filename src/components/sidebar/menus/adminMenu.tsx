
import React from 'react';
import { 
  Users, 
  Folders, 
  Trophy, 
  Building, 
  FileText, 
  School,
  BookOpen
} from 'lucide-react';
import { SidebarMenuGroup } from '../types';

export const adminMenuItems: SidebarMenuGroup[] = [
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
