
import React from 'react';
import { 
  Briefcase, 
  GitPullRequest 
} from 'lucide-react';
import { SidebarMenuGroup } from '../types';

export const employerMenuItems: SidebarMenuGroup[] = [
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
