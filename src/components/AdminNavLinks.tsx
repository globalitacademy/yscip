
import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  BookOpenCheck, 
  LayoutDashboard, 
  FolderKanban,
  BookOpen,
  ClipboardList,
  Settings
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBadge from '@/components/NotificationBadge';

const AdminNavLinks = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      <NavLink to="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Կառավարման վահանակ" />
      
      {isAdmin && (
        <NavLink to="/admin/users" icon={<Users className="h-4 w-4" />} label="Օգտատերեր" />
      )}
      
      <NavLink to="/admin/admin-projects" icon={<FolderKanban className="h-4 w-4" />} label="Նախագծեր" />
      
      <NavLink to="/admin/courses" icon={<GraduationCap className="h-4 w-4" />} label="Դասընթացներ" />
      
      <NavLink to="/admin/all-courses" icon={<BookOpen className="h-4 w-4" />} label="Բոլոր դասընթացները" />
      
      {isAdmin && (
        <NavLink 
          to="/admin/course-applications" 
          icon={<ClipboardList className="h-4 w-4" />} 
          label="Դասընթացի դիմումներ" 
        />
      )}
      
      <NavLink 
        to="/admin/notifications" 
        icon={<NotificationBadge />} 
        label="Ծանուցումներ" 
      />
      
      {isAdmin && (
        <NavLink to="/admin/settings" icon={<Settings className="h-4 w-4" />} label="Կարգավորումներ" />
      )}
    </nav>
  );
};

export default AdminNavLinks;
