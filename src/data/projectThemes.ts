export interface ProjectTheme {
  id: number;
  title: string;
  description: string;
  image?: string;
  category: string;
  techStack?: string[];
  complexity?: string;
  duration?: string;
  createdBy?: string;
  createdAt?: string;
  tasks?: Task[];
  timeline?: TimelineEvent[];
  is_public?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'done';
  assignee: string;
  dueDate: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}
