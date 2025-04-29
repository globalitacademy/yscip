
import React from 'react';
import { 
  Folders, 
  CheckSquare,
  Briefcase 
} from 'lucide-react';
import { SidebarMenuGroup } from '../types';

export const studentMenuItems: SidebarMenuGroup[] = [
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
        icon: <Briefcase className="h-4 w-4" />,
        href: '/admin/portfolio',
        roles: ['student']
      }
    ]
  }
];
