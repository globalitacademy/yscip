import { rolePermissions } from '@/data/rolePermissions';

export interface UserPermissions {
  canAddTimeline: boolean;
  canApproveTimelineEvents: boolean;
  canAddTasks: boolean;
  canSubmitProject: boolean;
  canApproveProject: boolean;
  canCreateProjects: boolean;
  canAssignProjects: boolean;
}

export const useProjectPermissions = (userRole?: string): UserPermissions => {
  // Get permissions based on user role, default to student if no role provided
  const permissions = userRole 
    ? rolePermissions[userRole as keyof typeof rolePermissions] 
    : rolePermissions.student;
  
  return {
    canAddTimeline: permissions.canAddTimeline || false,
    canApproveTimelineEvents: permissions.canApproveTimelineEvents || false,
    canAddTasks: permissions.canAddTasks || false,
    canSubmitProject: permissions.canSubmitProject || false,
    canApproveProject: permissions.canApproveProject || false,
    canCreateProjects: permissions.canCreateProjects || false,
    canAssignProjects: 'canAssignProjects' in permissions ? permissions.canAssignProjects : false,
  };
};
