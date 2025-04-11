
import { rolePermissions } from '@/data/rolePermissions';
import { UserRole } from '@/types/user';

export interface UserPermissions {
  canAddTimeline: boolean;
  canApproveTimelineEvents: boolean;
  canAddTasks: boolean;
  canSubmitProject: boolean;
  canApproveProject: boolean;
  canCreateProjects: boolean;
  canAssignProjects: boolean;
  canViewAllProjects: boolean;
}

export const useProjectPermissions = (userRole?: string): UserPermissions => {
  // Cast userRole to UserRole type
  const role = userRole as UserRole | undefined;
  
  // Get permissions based on user role, default to student if no role provided
  const permissions = role 
    ? rolePermissions[role] 
    : rolePermissions.student;
  
  return {
    canAddTimeline: permissions.canAddTimeline || false,
    canApproveTimelineEvents: permissions.canApproveTimelineEvents || false,
    canAddTasks: permissions.canAddTasks || false,
    canSubmitProject: permissions.canSubmitProject || false,
    canApproveProject: permissions.canApproveProject || false,
    canCreateProjects: permissions.canCreateProjects || false,
    canAssignProjects: 'canAssignProjects' in permissions ? permissions.canAssignProjects : false,
    canViewAllProjects: 'canViewAllProjects' in permissions ? permissions.canViewAllProjects : false,
  };
};
