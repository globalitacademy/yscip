export type UserRole = 'admin' | 'lecturer' | 'project_manager' | 'employer' | 'student' | 'instructor' | 'supervisor';

export interface DBUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  course?: string;
  group_name?: string;
  organization?: string;
  specialization?: string;
  registration_approved: boolean;
  created_at: string;
  updated_at: string;
  bio?: string;
  group?: string;
  assignedProjects?: number[];
  supervisedStudents?: string[];
}

export interface DBProject {
  id: number;
  title: string;
  description: string;
  category: string;
  image?: string;
  duration?: string;
  tech_stack: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DBProjectAssignment {
  id: number;
  project_id: number;
  student_id: string;
  supervisor_id?: string;
  instructor_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DBNotification {
  id: number;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
}

export interface DBTask {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assigned_to?: string;
  created_by?: string;
  project_id: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DBTimelineEvent {
  id: number;
  project_id: number;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task extends Omit<DBTask, 'id'> {
  id: string;
}

export const convertDBTaskToTask = (dbTask: DBTask): Task => ({
  ...dbTask,
  id: dbTask.id.toString()
});
