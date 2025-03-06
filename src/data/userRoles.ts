
export type UserRole = 'admin' | 'supervisor' | 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Mock users for demo purposes
export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Ադմինիստրատոր',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    id: 'supervisor1',
    name: 'Ծրագրի ղեկավար',
    email: 'supervisor@example.com',
    role: 'supervisor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supervisor'
  },
  {
    id: 'instructor1',
    name: 'Դասախոս',
    email: 'instructor@example.com',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'
  },
  {
    id: 'student1',
    name: 'Ուսանող',
    email: 'student@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'
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
    canApproveProject: true
  },
  supervisor: {
    canAddTimeline: true,
    canEditTimeline: true,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canAssignTasks: true,
    canApproveProject: true
  },
  instructor: {
    canAddTimeline: true,
    canEditTimeline: false,
    canApproveTimelineEvents: true,
    canAddTasks: true,
    canAssignTasks: true,
    canApproveProject: true
  },
  student: {
    canAddTimeline: false,
    canEditTimeline: false,
    canApproveTimelineEvents: false,
    canAddTasks: false,
    canAssignTasks: false,
    canSubmitProject: true
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
