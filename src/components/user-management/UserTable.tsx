
import React from 'react';
import { User, UserRole } from '@/types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Users } from 'lucide-react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { AssignSupervisorDialog } from './AssignSupervisorDialog';

interface UserTableProps {
  users: User[];
  supervisors: User[];
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onAssignSupervisor: (studentId: string, supervisorId: string) => void;
  openEditUser: string | null;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  supervisors,
  onEditUser,
  onDeleteUser,
  onAssignSupervisor,
  openEditUser,
}) => {
  const { user: currentUser } = useAuth();

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'admin': return 'Ադմինիստրատոր';
      case 'supervisor': return 'Ծրագրի ղեկավար';
      case 'project_manager': return 'Պրոեկտի մենեջեր';
      case 'instructor': return 'Դասախոս';
      case 'lecturer': return 'Դասախոս';
      case 'employer': return 'Գործատու';
      case 'student': return 'Ուսանող';
      default: return role;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px] text-left">ID</TableHead>
          <TableHead className="text-left">Օգտատեր</TableHead>
          <TableHead className="text-left">Էլ․ հասցե</TableHead>
          <TableHead className="text-left">Դերակատարում</TableHead>
          <TableHead className="text-left">Ֆակուլտետ</TableHead>
          <TableHead className="text-left">Կուրս/Խումբ</TableHead>
          <TableHead className="text-right">Գործողություններ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{getRoleDisplayName(user.role)}</TableCell>
            <TableCell>{user.department}</TableCell>
            <TableCell>
              {user.role === 'student' && user.course && user.group ? 
                `${user.course}-րդ կուրս, ${user.group}` : 
                ''}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {user.role === 'student' && (
                  <AssignSupervisorDialog 
                    studentId={user.id}
                    studentName={user.name}
                    supervisors={supervisors}
                    onAssignSupervisor={onAssignSupervisor}
                  />
                )}
                <Button 
                  variant="outline" 
                  size="icon" 
                  title="Խմբագրել"
                  onClick={() => onEditUser(user.id)}
                >
                  <Pencil size={14} />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => onDeleteUser(user.id)}
                  title="Ջնջել"
                  disabled={user.email === 'gitedu@bk.ru' || user.email === currentUser?.email}
                >
                  <Trash size={14} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
