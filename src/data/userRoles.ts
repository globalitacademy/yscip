
export type UserRole = 'admin' | 'supervisor' | 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  course?: string;
  group?: string;
  assignedProjects?: number[];
  supervisedStudents?: string[];
}

// Mock users for demo purposes
export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Ադմինիստրատոր',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    department: 'Ինֆորմատիկայի ֆակուլտետ'
  },
  {
    id: 'supervisor1',
    name: 'Ծրագրի ղեկավար',
    email: 'supervisor@example.com',
    role: 'supervisor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supervisor',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    supervisedStudents: ['student1', 'student2']
  },
  {
    id: 'instructor1',
    name: 'Դասախոս',
    email: 'instructor@example.com',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    assignedProjects: [1, 2, 3]
  },
  {
    id: 'student1',
    name: 'Ուսանող',
    email: 'student@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '2',
    group: 'ԿՄ-021'
  },
  {
    id: 'student2',
    name: 'Երկրորդ Ուսանող',
    email: 'student2@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '3',
    group: 'ԿՄ-031'
  }
];

// Role permissions
export const rolePermissions = {
  admin: {
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
  supervisor: {
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
    canViewAllProjects: true,
    canManageUsers: false
  },
  instructor: {
    canAddTimeline: true,
    canEditTimeline: false,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canAssignTasks: true,
    canApproveProject: true,
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

export const getCurrentUser = (): User => {
  // This would typically come from authentication
  // For demo purposes, we'll default to the student
  return mockUsers.find(user => user.role === 'student') || mockUsers[3];
};

export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};

// Get course options
export const getCourses = (): string[] => {
  const courses = mockUsers
    .filter(user => user.role === 'student' && user.course)
    .map(user => user.course as string);
  
  return [...new Set(courses)].sort();
};

// Get group options
export const getGroups = (course?: string): string[] => {
  const groups = mockUsers
    .filter(user => 
      user.role === 'student' && 
      user.group && 
      (!course || user.course === course)
    )
    .map(user => user.group as string);
  
  return [...new Set(groups)].sort();
};

// Get students by course and group
export const getStudentsByCourseAndGroup = (course?: string, group?: string): User[] => {
  return mockUsers.filter(user => 
    user.role === 'student' && 
    (!course || user.course === course) && 
    (!group || user.group === group)
  );
};

