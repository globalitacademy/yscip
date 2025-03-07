
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  UsersRound, 
  GraduationCap, 
  Building, 
  Settings, 
  FileBarChart,
  UserCog,
  Briefcase,
  ClipboardList,
  Bell
} from 'lucide-react';

interface AdminSidebarProps {
  onCloseMenu?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMenu }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user || (user.role !== 'admin' && 
                user.role !== 'lecturer' && 
                user.role !== 'instructor' && 
                user.role !== 'project_manager' && 
                user.role !== 'supervisor')) {
    return null;
  }
  
  // Base menu items that appear for all roles
  const baseMenuItems = [
    { 
      label: 'Դաշբորդ', 
      path: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'lecturer', 'instructor', 'project_manager', 'supervisor']
    }
  ];
  
  // Role-specific menu items
  const adminMenuItems = [
    { 
      label: 'Օգտատերեր', 
      path: '/users',
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      label: 'Կուրսեր', 
      path: '/courses/manage',
      icon: <BookOpen className="w-5 h-5" /> 
    },
    { 
      label: 'Խմբեր', 
      path: '/groups',
      icon: <UsersRound className="w-5 h-5" /> 
    },
    { 
      label: 'Դասախոսներ', 
      path: '/lecturers',
      icon: <UserCog className="w-5 h-5" /> 
    },
    { 
      label: 'Ղեկավարներ', 
      path: '/supervisors',
      icon: <UserCog className="w-5 h-5" /> 
    },
    { 
      label: 'Կազմակերպություններ', 
      path: '/organizations',
      icon: <Building className="w-5 h-5" /> 
    },
    { 
      label: 'Մասնագիտություններ', 
      path: '/specializations',
      icon: <GraduationCap className="w-5 h-5" /> 
    },
    { 
      label: 'Նախագծեր', 
      path: '/projects/manage',
      icon: <Briefcase className="w-5 h-5" /> 
    },
    { 
      label: 'Թասքեր', 
      path: '/tasks',
      icon: <ClipboardList className="w-5 h-5" /> 
    },
    { 
      label: 'Հաշվետվություններ', 
      path: '/reports',
      icon: <FileBarChart className="w-5 h-5" /> 
    },
    { 
      label: 'Ծանուցումներ', 
      path: '/notifications',
      icon: <Bell className="w-5 h-5" /> 
    },
    { 
      label: 'Կարգավորումներ', 
      path: '/settings',
      icon: <Settings className="w-5 h-5" /> 
    }
  ];
  
  const lecturerMenuItems = [
    { 
      label: 'Կուրսեր', 
      path: '/courses',
      icon: <BookOpen className="w-5 h-5" /> 
    },
    { 
      label: 'Խմբեր', 
      path: '/groups',
      icon: <UsersRound className="w-5 h-5" /> 
    },
    { 
      label: 'Թասքեր', 
      path: '/tasks',
      icon: <ClipboardList className="w-5 h-5" /> 
    }
  ];
  
  const supervisorMenuItems = [
    { 
      label: 'Նախագծեր', 
      path: '/projects/manage',
      icon: <Briefcase className="w-5 h-5" /> 
    },
    { 
      label: 'Ուսանողներ', 
      path: '/supervised-students',
      icon: <UsersRound className="w-5 h-5" /> 
    },
    { 
      label: 'Թասքեր', 
      path: '/tasks',
      icon: <ClipboardList className="w-5 h-5" /> 
    }
  ];
  
  // Determine which menu items to show based on user role
  let menuItems = baseMenuItems;
  
  if (user.role === 'admin') {
    menuItems = [...baseMenuItems, ...adminMenuItems];
  } else if (user.role === 'lecturer' || user.role === 'instructor') {
    menuItems = [...baseMenuItems, ...lecturerMenuItems];
  } else if (user.role === 'project_manager' || user.role === 'supervisor') {
    menuItems = [...baseMenuItems, ...supervisorMenuItems];
  }
  
  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="text-xl font-bold">Ադմինիստրացիա</div>
        {onCloseMenu && (
          <Button variant="ghost" size="icon" onClick={onCloseMenu} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.path}>
            <Button
              variant={location.pathname === item.path ? "default" : "ghost"}
              className={`w-full justify-start ${location.pathname === item.path ? "" : "text-muted-foreground"}`}
              onClick={onCloseMenu}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
