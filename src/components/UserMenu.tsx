
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LogOut, User, UserCog, GraduationCap, ChevronDown, Building, School, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/data/mockUsers';
import { toast } from 'sonner';

const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Button variant="ghost" onClick={() => navigate('/login')}>
        Մուտք
      </Button>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <UserCog className="h-4 w-4 mr-2" />;
      case 'project_manager':
      case 'supervisor':
        return <UserCog className="h-4 w-4 mr-2" />;
      case 'lecturer':
      case 'instructor':
        return <School className="h-4 w-4 mr-2" />;
      case 'employer':
        return <Building className="h-4 w-4 mr-2" />;
      case 'student':
        return <GraduationCap className="h-4 w-4 mr-2" />;
      default:
        return <User className="h-4 w-4 mr-2" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Ադմինիստրատոր';
      case 'project_manager':
        return 'Նախագծի ղեկավար';
      case 'supervisor':
        return 'Ղեկավար';
      case 'lecturer':
        return 'Դասախոս';
      case 'instructor':
        return 'Դասախոս';
      case 'employer':
        return 'Գործատու';
      case 'student':
        return 'Ուսանող';
      default:
        return role;
    }
  };

  const handleLogout = () => {
    toast.info("Դուրս գալու ֆունկցիոնալությունը ժամանակավորապես անջատված է։");
    logout();
  };

  const handleDashboardClick = () => {
    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'student':
        navigate('/student-dashboard');
        break;
      case 'employer':
        navigate('/employer-dashboard');
        break;
      case 'lecturer':
      case 'instructor':
        navigate('/lecturer-dashboard');
        break;
      case 'supervisor':
      case 'project_manager':
        navigate('/supervisor-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 focus:ring-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-block">{user.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Իմ հաշիվը</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleDashboardClick} className="flex items-center cursor-pointer">
          <LayoutDashboard className="h-4 w-4 mr-2" />
          <span>Կառավարման վահանակ</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem disabled className="flex justify-between">
          <span>Ընթացիկ դերը</span>
          <span className="font-semibold text-primary flex items-center">
            {getRoleIcon(user.role)}
            {getRoleLabel(user.role)}
          </span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Փոխել դերը (Դեմո)</DropdownMenuLabel>
        
        {mockUsers
          .filter(u => u.id !== user.id && u.registrationApproved)
          .map(u => (
            <DropdownMenuItem key={u.id} onClick={() => switchRole(u.role)}>
              <div className="flex items-center">
                {getRoleIcon(u.role)}
                <span>{getRoleLabel(u.role)}</span>
              </div>
            </DropdownMenuItem>
          ))
        }
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Դուրս գալ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
