
// User role types
export type UserRole = 'admin' | 'lecturer' | 'project_manager' | 'employer' | 'student' | 'instructor' | 'supervisor' | 'superadmin';

// User type for the application
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  registrationApproved: boolean;
  avatar?: string;
  organization?: string;
  department?: string;
}

// Define available permissions for different roles
export const rolePermissions = {
  superadmin: {
    canManageUsers: true,
    canManageProjects: true,
    canManageCourses: true,
    canManageOrganizations: true,
    canApproveProjects: true,
    canViewAllProjects: true,
  },
  admin: {
    canManageUsers: true,
    canManageProjects: true,
    canManageCourses: true,
    canManageOrganizations: true,
    canApproveProjects: true,
    canViewAllProjects: true,
  },
  lecturer: {
    canManageStudents: true,
    canManageCourses: true,
    canViewStudentProjects: true,
    canEvaluateProjects: true,
  },
  project_manager: {
    canManageProjects: true,
    canAssignProjects: true,
    canViewAllProjects: true,
  },
  supervisor: {
    canReviewProjects: true,
    canMentor: true,
    canEvaluateProjects: true,
  },
  instructor: {
    canTeach: true,
    canGrade: true,
  },
  employer: {
    canSubmitProjects: true,
    canViewOwnProjects: true,
  },
  student: {
    canSelectProjects: true,
    canSubmitWork: true,
    canViewAssignedProjects: true,
  },
};
