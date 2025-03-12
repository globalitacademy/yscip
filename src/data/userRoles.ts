
import { User, UserRole } from '@/types/user';
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

// Re-export everything for backward compatibility
export { 
  User, 
  UserRole, 
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
