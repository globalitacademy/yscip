
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
}

/**
 * Type definition for timeline events in the project
 */
export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

/**
 * Type definition for project tasks
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  completedAt?: string;
}
