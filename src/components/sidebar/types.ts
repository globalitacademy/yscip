
import React from 'react';

export interface SidebarMenuItemType {
  title: string;
  icon: React.ReactNode;
  href: string;
  label?: string;
  path?: string;
  roles: string[];
}

export interface SidebarMenuGroup {
  title: string;
  items: SidebarMenuItemType[];
}
