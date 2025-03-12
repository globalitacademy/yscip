
export type UserRole = 'admin' | 'lecturer' | 'project_manager' | 'employer' | 'student' | 'instructor' | 'supervisor';

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
  bio?: string;
}
