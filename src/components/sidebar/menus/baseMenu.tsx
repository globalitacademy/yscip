
import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { SidebarMenuGroup } from '../types';

export const baseMenuItems: SidebarMenuGroup[] = [
  {
    title: 'Հիմնական',
    items: [
      {
        title: 'Կառավարման վահանակ',
        icon: <LayoutDashboard className="h-4 w-4" />,
        href: '/admin/dashboard',
        roles: ['admin', 'lecturer', 'instructor', 'supervisor', 'project_manager', 'employer', 'student']
      }
    ]
  }
];
