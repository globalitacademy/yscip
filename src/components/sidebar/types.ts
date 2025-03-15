
import { ReactNode } from 'react';
import { UserRole } from '@/types/user';

export interface SidebarMenuItemType {
  title: string;
  icon: ReactNode;
  href: string;
  roles: UserRole[];
}

export interface SidebarMenuGroup {
  title: string;
  items: SidebarMenuItemType[];
}
