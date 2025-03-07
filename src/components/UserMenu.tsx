
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
import { LogOut, User, UserCog, GraduationCap, ChevronDown, Building, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/data/userRoles';

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
      case 'supervisor':
        return <UserCog className="h-4 w-4 mr-2" />;
      case 'lecturer':
        return <School className="h-4 w-4 mr-2" />;
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
      case 'supervisor':
        return 'Ղեկավար';
      case 'lecturer':
        return 'Դասախոս';
      case 'student':
        return 'Ուսանող';
      default:
        return role;
    }
  };

  // Only show these four roles in the dropdown
  const availableRoles = [
    { id: 'role1', role: 'admin' as UserRole },
    { id: 'role2', role: 'lecturer' as UserRole },
    { id: 'role3', role: 'student' as UserRole },
    { id: 'role4', role: 'supervisor' as UserRole }
  ];

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
        
        <DropdownMenuItem disabled className="flex justify-between">
          <span>Ընթացիկ դերը</span>
          <span className="font-semibold text-primary flex items-center">
            {getRoleIcon(user.role)}
            {getRoleLabel(user.role)}
          </span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Փոխել դերը (Դեմո)</DropdownMenuLabel>
        
        {availableRoles
          .filter(u => u.role !== user.role)
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
        <DropdownMenuItem onClick={() => logout()} className="text-red-500 focus:text-red-500">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Դուրս գալ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
