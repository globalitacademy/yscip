
import React from 'react';
import { 
  Users, 
  MousePointerClick,
  CheckSquare 
} from 'lucide-react';
import { SidebarMenuGroup } from '../types';

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
