
/**
 * Type definition for the project theme data
 */
export interface ProjectTheme {
  id: number;
  title: string;
  description: string;
  category: string;
  image?: string;
  techStack: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  duration: string;
  createdBy?: string;
  is_public?: boolean;
  organizationName?: string;
  similarProjects?: ProjectTheme[];
  goal?: string;
  requirements?: string[];
  resources?: { name: string; url: string }[];
  links?: { name: string; url: string }[];
  createdAt?: string;
  updatedAt?: string;
  // Additional properties needed
  detailedDescription?: string;
  steps?: string[];
  prerequisites?: string[];
  learningOutcomes?: string[];
  timeline?: TimelineEvent[];
  tasks?: Task[];
  complexity?: string;
}

/**
 * Type definition for timeline events in the project
 */
export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  isCompleted: boolean;
  description?: string;
}

/**
 * Type definition for project tasks
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  status: 'todo' | 'inProgress' | 'in-progress' | 'review' | 'done' | 'completed' | 'open';
  createdAt?: string;
  completedAt?: string;
}
