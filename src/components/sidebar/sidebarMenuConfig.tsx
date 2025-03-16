
import { SidebarMenuItemType } from './types';

// Import all menu items from separate files
export { baseMenuItems } from './menus/baseMenu';
export { adminMenuItems } from './menus/adminMenu';
export { lecturerMenuItems } from './menus/lecturerMenu';
export { supervisorMenuItems } from './menus/supervisorMenu';
export { employerMenuItems } from './menus/employerMenu';
export { studentMenuItems } from './menus/studentMenu';

// Re-export the type for use in other components
export type { SidebarMenuItemType };
