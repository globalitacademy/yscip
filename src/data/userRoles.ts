
export type UserRole = 'admin' | 'lecturer' | 'project_manager' | 'employer' | 'student';

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
  organization?: string;
  specialization?: string;
  registrationApproved?: boolean;
}

// Mock users for demo purposes
export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Ադմինիստրատոր',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    registrationApproved: true
  },
  {
    id: 'project_manager1',
    name: 'Նախագծի ղեկավար',
    email: 'manager@example.com',
    role: 'project_manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supervisor',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    supervisedStudents: ['student1', 'student2'],
    registrationApproved: true
  },
  {
    id: 'supervisor1',
    name: 'Ղեկավար',
    email: 'supervisor@example.com',
    role: 'supervisor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supervisor2',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    supervisedStudents: ['student1'],
    registrationApproved: true
  },
  {
    id: 'lecturer1',
    name: 'Դասախոս',
    email: 'lecturer@example.com',
    role: 'lecturer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    assignedProjects: [1, 2, 3],
    registrationApproved: true
  },
  {
    id: 'instructor1',
    name: 'Դասախոս 2',
    email: 'instructor@example.com',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor2',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    assignedProjects: [4, 5],
    registrationApproved: true
  },
  {
    id: 'employer1',
    name: 'Գործատու',
    email: 'employer@example.com',
    role: 'employer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=employer',
    organization: 'Տեխնոլոջի ՍՊԸ',
    registrationApproved: true
  },
  {
    id: 'student1',
    name: 'Ուսանող',
    email: 'student@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '2',
    group: 'ԿՄ-021',
    registrationApproved: true
  },
  {
    id: 'student2',
    name: 'Երկրորդ Ուսանող',
    email: 'student2@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '3',
    group: 'ԿՄ-031',
    registrationApproved: true
  }
];

// Role permissions
export const rolePermissions = {
  admin: {
    // User Management
    canCreateRoles: true,
    canEditRoles: true,
    canApproveRegistrations: true,
    
    // Administration
    canManageSpecializations: true, // CRUD for specializations/courses/groups
    canRegisterOrganizations: true, // Register partner companies
    canViewReports: true, // Statistics, usage metrics
    
    // General permissions
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
    // Task Management
    canCreateModularTasks: true, // Create modular tasks by course/group
    canSetDeadlines: true, // Set deadlines, evaluation criteria
    
    // Assessment
    canAutoCheck: true, // Automated checking (quiz/test) and manual grading
    canFilterByStudent: true, // Filter by student/group/course
    canViewStudentProgress: true, // Student progress dashboard
    
    // General permissions
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
    canViewAllProjects: false,
    canManageUsers: false
  },
  
  project_manager: {
    // Project Management
    canCreateSteppedProjects: true, // Create step-by-step projects (Waterfall/Agile phases)
    canModifyProjectSteps: true, // Change step sequence/deadlines
    canApproveEmployerProjects: true, // Approve employer projects
    
    // Tracking
    canViewGanttChart: true, // Gantt chart for implementation
    canUpdateTaskStatus: true, // Update task status (To-Do/In Progress/Done)
    
    // General permissions
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
    // Project Announcement
    canAnnounceProjects: true, // Project description form (technologies, requirements, deadline)
    canLinkProjectToCourse: true, // Link between project and course (e.g., "Python + Django" for a course)
    canCollaborateWithManager: true, // Collaboration with project manager
    
    // General permissions
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
    // Project Selection
    canFilterProjects: true, // Filter by technology/course/difficulty
    canApplyToProject: true, // Apply to project (CV/motivation letter upload)
    
    // Execution
    canViewTaskTimeline: true, // Task list in timeline view
    canUploadFiles: true, // File upload/submission (GitHub integration)
    canViewProgressMap: true, // Mapping student progress (progress heatmap)
    
    // CV Generator
    canGenerateCV: true, // Automatic form based on completed projects/skills
    canDownloadCVFormats: true, // Download in PDF/Word format
    
    // General permissions
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
  return mockUsers.find(user => user.role === 'student') || mockUsers[4];
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
      (!course || course === 'all' || user.course === course)
    )
    .map(user => user.group as string);
  
  return [...new Set(groups)].sort();
};

// Get students by course and group
export const getStudentsByCourseAndGroup = (course?: string, group?: string): User[] => {
  return mockUsers.filter(user => 
    user.role === 'student' && 
    (!course || course === 'all' || user.course === course) && 
    (!group || group === 'all' || user.group === group)
  );
};

// Get project assignments for specific user
export const getProjectAssignmentsForUser = (userId: string): number[] => {
  try {
    const assignments = localStorage.getItem('projectAssignments');
    if (!assignments) return [];
    
    const parsedAssignments = JSON.parse(assignments);
    return parsedAssignments
      .filter((a: any) => a.studentId === userId)
      .map((a: any) => Number(a.projectId));
  } catch (e) {
    console.error('Error loading project assignments:', e);
    return [];
  }
};

// Get students assigned to specific projects
export const getStudentsForProject = (projectId: number): User[] => {
  try {
    const assignments = localStorage.getItem('projectAssignments');
    if (!assignments) return [];
    
    const parsedAssignments = JSON.parse(assignments);
    const studentIds = parsedAssignments
      .filter((a: any) => Number(a.projectId) === projectId)
      .map((a: any) => a.studentId);
    
    return mockUsers.filter(user => studentIds.includes(user.id));
  } catch (e) {
    console.error('Error finding students for project:', e);
    return [];
  }
};
