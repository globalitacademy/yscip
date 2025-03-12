
import type { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { rolePermissions } from '@/data/rolePermissions';
import { 
  getCurrentUser, 
  getUsersByRole, 
  getCourses, 
  getGroups, 
  getStudentsByCourseAndGroup 
} from '@/utils/userUtils';
import { 
  getProjectAssignmentsForUser, 
  getStudentsForProject 
} from '@/utils/projectAssignments';

// Re-export types with explicit 'export type'
export type { User, UserRole };

// Re-export values
export { 
  mockUsers, 
  rolePermissions,
  getCurrentUser,
  getUsersByRole,
  getCourses,
  getGroups,
  getStudentsByCourseAndGroup,
  getProjectAssignmentsForUser,
  getStudentsForProject
};

