
import { useAuth } from '@/contexts/AuthContext';
import { rolePermissions } from '@/data/rolePermissions';

export const useCoursePermissions = () => {
  const { user } = useAuth();
  
  // Permissions for course management
  const canCreateCourse = user && (
    user.role === 'admin' || 
    user.role === 'lecturer' || 
    user.role === 'instructor' ||
    user.role === 'employer'
  );
  
  const canEditAnyCourse = user && (
    user.role === 'admin'
  );
  
  const canEditOwnCourse = user && (
    user.role === 'lecturer' ||
    user.role === 'instructor' ||
    user.role === 'employer'
  );
  
  const canDeleteAnyCourse = user && (
    user.role === 'admin'
  );
  
  const canDeleteOwnCourse = user && (
    user.role === 'lecturer' ||
    user.role === 'instructor' ||
    user.role === 'employer'
  );
  
  const canApproveCourse = user && (
    user.role === 'admin'
  );
  
  const requiresApproval = user && (
    user.role === 'lecturer' ||
    user.role === 'instructor' ||
    user.role === 'employer'
  );

  // Combined permissions
  const canEditCourse = (createdBy: string) => {
    if (!user) return false;
    return canEditAnyCourse || (canEditOwnCourse && user.id === createdBy);
  };
  
  const canDeleteCourse = (createdBy: string) => {
    if (!user) return false;
    return canDeleteAnyCourse || (canDeleteOwnCourse && user.id === createdBy);
  };
  
  return {
    canCreateCourse,
    canEditAnyCourse,
    canEditOwnCourse,
    canDeleteAnyCourse,
    canDeleteOwnCourse,
    canApproveCourse,
    requiresApproval,
    canEditCourse,
    canDeleteCourse
  };
};
