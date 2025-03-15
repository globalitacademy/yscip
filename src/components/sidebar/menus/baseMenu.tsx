
import React from 'react';
import { LayoutDashboard, Bell } from 'lucide-react';
import { SidebarMenuGroup } from '../types';

export const baseMenuItems: SidebarMenuGroup[] = [
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
