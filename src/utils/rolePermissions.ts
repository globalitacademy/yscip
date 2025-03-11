
import { UserRole } from '@/types/database.types';

interface RolePermissions {
  [key: string]: boolean;
}

const permissions: Record<UserRole, RolePermissions> = {
  admin: {
    canCreateRoles: true,
    canEditRoles: true,
    canApproveRegistrations: true,
    
    canManageSpecializations: true,
    canRegisterOrganizations: true,
    canViewReports: true,
    
    canAddTimeline: true,
    canEditTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canAssignTasks: true,
    canApproveProject: true,
    canSubmitProject: false,
    canCreateUsers: true,
    canAssignInstructors: true,
    canAssignSupervisors: true,
    canCreateProjects: true,
    canAssignProjects: true,
    canViewAllProjects: true,
    canManageUsers: true
  },
  
  lecturer: {
    canCreateModularTasks: true,
    canSetDeadlines: true,
    
    canAutoCheck: true,
    canFilterByStudent: true,
    canViewStudentProgress: true,
    
    canAddTimeline: true,
    canEditTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canAssignTasks: true,
    canApproveProject: true,
    canSubmitProject: false,
    canCreateUsers: false,
    canAssignInstructors: false,
    canAssignSupervisors: false,
    canCreateProjects: true,
    canAssignProjects: true,
    canViewAllProjects: false,
    canManageUsers: false
  },
  
  instructor: {
    canCreateModularTasks: true,
    canSetDeadlines: true,
    
    canAutoCheck: true,
    canFilterByStudent: true,
    canViewStudentProgress: true,
    
    canAddTimeline: true,
    canEditTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canAssignTasks: true,
    canApproveProject: true,
    canSubmitProject: false,
    canCreateUsers: false,
    canAssignInstructors: false,
    canAssignSupervisors: false,
    canCreateProjects: true,
    canAssignProjects: true,
    canViewAllProjects: false,
    canManageUsers: false
  },
  
  supervisor: {
    canCreateSteppedProjects: true,
    canModifyProjectSteps: true,
    canApproveEmployerProjects: true,
    
    canViewGanttChart: true,
    canUpdateTaskStatus: true,
    
    canAddTimeline: true,
    canEditTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canAssignTasks: true,
    canApproveProject: true,
    canSubmitProject: false,
    canCreateUsers: false,
    canAssignInstructors: false,
    canAssignSupervisors: true,
    canCreateProjects: true,
    canAssignProjects: true,
    canViewAllProjects: true,
    canManageUsers: false
  },
  
  project_manager: {
    canCreateSteppedProjects: true,
    canModifyProjectSteps: true,
    canApproveEmployerProjects: true,
    
    canViewGanttChart: true,
    canUpdateTaskStatus: true,
    
    canAddTimeline: true,
    canEditTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canAssignTasks: true,
    canApproveProject: true,
    canSubmitProject: false,
    canCreateUsers: false,
    canAssignInstructors: false,
    canAssignSupervisors: true,
    canCreateProjects: true,
    canAssignProjects: true,
    canViewAllProjects: true,
    canManageUsers: false
  },
  
  employer: {
    canAnnounceProjects: true,
    canLinkProjectToCourse: true,
    canCollaborateWithManager: true,
    
    canAddTimeline: false,
    canEditTimeline: false,
    canApproveTimelineEvents: false,
    canAddTasks: true,
    canAssignTasks: false,
    canApproveProject: false,
    canSubmitProject: false,
    canCreateUsers: false,
    canAssignInstructors: false,
    canAssignSupervisors: false,
    canCreateProjects: true,
    canAssignProjects: false,
    canViewAllProjects: false,
    canManageUsers: false
  },
  
  student: {
    canFilterProjects: true,
    canApplyToProject: true,
    
    canViewTaskTimeline: true,
    canUploadFiles: true,
    canViewProgressMap: true,
    
    canGenerateCV: true,
    canDownloadCVFormats: true,
    
    canAddTimeline: false,
    canEditTimeline: false,
    canApproveTimelineEvents: false,
    canAddTasks: false,
    canAssignTasks: false,
    canApproveProject: false,
    canSubmitProject: true,
    canCreateUsers: false,
    canAssignInstructors: false,
    canAssignSupervisors: false,
    canCreateProjects: false,
    canAssignProjects: false,
    canViewAllProjects: false,
    canManageUsers: false
  }
};

export const hasPermission = (role: UserRole | undefined, permission: string): boolean => {
  if (!role) return false;
  
  const rolePermissions = permissions[role];
  return !!rolePermissions[permission];
};

export const rolePermissions = permissions;
