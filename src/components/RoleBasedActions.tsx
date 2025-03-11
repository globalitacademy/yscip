
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserDataError, PendingApproval } from './role-actions/ErrorStates';
import AdminActions from './role-actions/AdminActions';
import TeacherActions from './role-actions/TeacherActions';
import ProjectManagerActions from './role-actions/ProjectManagerActions';
import EmployerActions from './role-actions/EmployerActions';
import StudentActions from './role-actions/StudentActions';
import GuestActions from './role-actions/GuestActions';
import { DBUser, UserRole } from '@/types/database.types';

interface RoleBasedActionsProps {
  isAuthenticated: boolean;
  user: DBUser | null;
  isApproved: boolean;
}

const RoleBasedActions: React.FC<RoleBasedActionsProps> = ({ 
  isAuthenticated, 
  user, 
  isApproved 
}) => {
  if (isAuthenticated && !user) {
    return <UserDataError />;
  }

  if (!isAuthenticated || !user) {
    return <GuestActions />;
  }
  
  if (!isApproved && user.role !== 'student') {
    return <PendingApproval />;
  }
  
  switch (user.role) {
    case 'admin':
      return <AdminActions />;
    case 'lecturer':
    case 'instructor':
      return <TeacherActions />;
    case 'project_manager':
    case 'supervisor':
      return <ProjectManagerActions />;
    case 'employer':
      return <EmployerActions />;
    case 'student':
      return <StudentActions />;
    default:
      return (
        <div className="mb-10">
          <Card className="bg-muted">
            <CardContent className="py-6">
              <p className="text-center">Անհայտ օգտատիրոջ դեր: {user.role}</p>
            </CardContent>
          </Card>
        </div>
      );
  }
};

export default RoleBasedActions;
