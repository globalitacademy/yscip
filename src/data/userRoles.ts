
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
  // Add missing properties
  course?: string;
  group?: string;
  bio?: string;
  supervisedStudents?: string[];
  assignedProjects?: number[];
}

// Mock users for testing and development
export const mockUsers: User[] = [
  {
    id: 'admin1',
    email: 'admin@npua.am',
    name: 'Ադմինիստրատոր',
    role: 'admin',
    registrationApproved: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    department: 'Ինֆորմատիկայի ֆակուլտետ'
  },
  {
    id: 'lecturer1',
    email: 'lecturer@npua.am',
    name: 'Վահան Պետրոսյան',
    role: 'lecturer',
    registrationApproved: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lecturer',
    department: 'Ինֆորմատիկայի ֆակուլտետ'
  },
  {
    id: 'supervisor1',
    email: 'supervisor@npua.am',
    name: 'Արամ Հակոբյան',
    role: 'supervisor',
    registrationApproved: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supervisor',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    supervisedStudents: ['student1', 'student2']
  },
  {
    id: 'student1',
    email: 'student1@npua.am',
    name: 'Արման Մկրտչյան',
    role: 'student',
    registrationApproved: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '3',
    group: 'ԿՄ-021'
  },
  {
    id: 'student2',
    email: 'student2@npua.am',
    name: 'Անահիտ Սարգսյան',
    role: 'student',
    registrationApproved: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '2',
    group: 'ԿՄ-031'
  },
  {
    id: 'employer1',
    email: 'employer@example.com',
    name: 'Սամվել Գևորգյան',
    role: 'employer',
    registrationApproved: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=employer',
    organization: 'SoftDev LLC'
  },
  {
    id: 'instructor1',
    email: 'instructor@npua.am',
    name: 'Կարեն Մանուկյան',
    role: 'instructor',
    registrationApproved: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    assignedProjects: [1, 2, 3]
  },
  {
    id: 'project_manager1',
    email: 'pm@npua.am',
    name: 'Տիգրան Հայրապետյան',
    role: 'project_manager',
    registrationApproved: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pm',
    department: 'Ինֆորմատիկայի ֆակուլտետ'
  }
];

// Define available permissions for different roles
export const rolePermissions = {
  superadmin: {
    canManageUsers: true,
    canManageProjects: true,
    canManageCourses: true,
    canManageOrganizations: true,
    canApproveProjects: true,
    canViewAllProjects: true,
    canAddTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canSubmitProject: true,
    canApproveProject: true,
    canCreateProjects: true,
    canAssignProjects: true
  },
  admin: {
    canManageUsers: true,
    canManageProjects: true,
    canManageCourses: true,
    canManageOrganizations: true,
    canApproveProjects: true,
    canViewAllProjects: true,
    canAddTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canSubmitProject: false,
    canApproveProject: true,
    canCreateProjects: true,
    canAssignProjects: true
  },
  lecturer: {
    canManageStudents: true,
    canManageCourses: true,
    canViewStudentProjects: true,
    canEvaluateProjects: true,
    canAddTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canSubmitProject: false,
    canApproveProject: true,
    canCreateProjects: true,
    canAssignProjects: true
  },
  project_manager: {
    canManageProjects: true,
    canAssignProjects: true,
    canViewAllProjects: true,
    canAddTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canSubmitProject: false,
    canApproveProject: true,
    canCreateProjects: true
  },
  supervisor: {
    canReviewProjects: true,
    canMentor: true,
    canEvaluateProjects: true,
    canAddTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canSubmitProject: false,
    canApproveProject: true,
    canCreateProjects: false,
    canAssignProjects: false
  },
  instructor: {
    canTeach: true,
    canGrade: true,
    canAddTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canSubmitProject: false,
    canApproveProject: true,
    canCreateProjects: true,
    canAssignProjects: true
  },
  employer: {
    canSubmitProjects: true,
    canViewOwnProjects: true,
    canAddTimeline: false,
    canApproveTimelineEvents: false,
    canAddTasks: false,
    canSubmitProject: true,
    canApproveProject: false,
    canCreateProjects: true,
    canAssignProjects: false
  },
  student: {
    canSelectProjects: true,
    canSubmitWork: true,
    canViewAssignedProjects: true,
    canAddTimeline: false,
    canApproveTimelineEvents: false,
    canAddTasks: false,
    canSubmitProject: true,
    canApproveProject: false,
    canCreateProjects: false,
    canAssignProjects: false
  },
};

// Get current user (mock function for now)
export const getCurrentUser = (): User => {
  // In a real application, this would get the current user from context or session
  return mockUsers[0]; // Return admin user as default
};

// Get users by role
export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};

// Get available courses
export const getCourses = (): string[] => {
  return ['1', '2', '3', '4', '5'];
};

// Get groups by course
export const getGroups = (course?: string): string[] => {
  if (!course) return [];
  
  const groups: Record<string, string[]> = {
    '1': ['ԿՄ-011', 'ԿՄ-012', 'ԿՄ-013'],
    '2': ['ԿՄ-021', 'ԿՄ-022', 'ԿՄ-023'],
    '3': ['ԿՄ-031', 'ԿՄ-032', 'ԿՄ-033'],
    '4': ['ԿՄ-041', 'ԿՄ-042', 'ԿՄ-043'],
    '5': ['ԿՄ-051', 'ԿՄ-052', 'ԿՄ-053'],
  };
  
  return groups[course] || [];
};

// Get students by course and group
export const getStudentsByCourseAndGroup = (course?: string, group?: string): User[] => {
  if (!course || !group) return [];
  
  return mockUsers.filter(
    user => user.role === 'student' && user.course === course && user.group === group
  );
};
