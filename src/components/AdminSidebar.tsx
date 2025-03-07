
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
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
  ClipboardList
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') {
    return null;
  }
  
  const menuItems = [
    { 
      label: 'Դաշբորդ', 
      path: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
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
      label: 'Կարգավորումներ', 
      path: '/settings',
      icon: <Settings className="w-5 h-5" /> 
    }
  ];
  
  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto px-4 py-6 hidden md:block">
      <div className="text-xl font-bold mb-8 px-2">Ադմինիստրացիա</div>
      
      <nav className="space-y-1">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.path}>
            <Button
              variant={location.pathname === item.path ? "default" : "ghost"}
              className={`w-full justify-start ${location.pathname === item.path ? "" : "text-muted-foreground"}`}
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
