import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme } from '@/data/projectThemes';
import { getUsersByRole } from '@/data/userRoles';
import { Task, TimelineEvent } from '@/data/projectThemes';

// Re-export utilities from specialized modules
export { 
  calculateProjectProgress, 
  generateSampleTimeline,
  generateSampleTasks 
} from './projectProgressUtils';

export type { 
  ProjectReservation
} from './reservationUtils';

export { 
  loadProjectReservations,
  saveProjectReservations,
  isProjectReservedByUser,
  saveProjectReservation,
  updateReservationStatus,
  getAvailableSupervisors
} from './reservationUtils';

// Filter projects by search query
export const filterProjects = (
  projects: ProjectTheme[], 
  searchQuery: string,
  selectedCategory: string | null = null
) => {
  let filtered = projects;
  
  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(project => 
      project.title?.toLowerCase().includes(query) || 
      project.description?.toLowerCase().includes(query) ||
      (project.category && project.category.toLowerCase().includes(query))
    );
  }
  
  // Filter by selected category
  if (selectedCategory) {
    filtered = filtered.filter(project => project.category === selectedCategory);
  }
  
  return filtered;
};

// Get unique categories from projects
export const getUniqueCategories = (projects: ProjectTheme[]) => {
  const categories = projects.map(project => project.category).filter(Boolean);
  return Array.from(new Set(categories)).sort();
};

// Calculate project progress based on tasks and timeline
export const calculateProjectProgress = (tasks: Task[], timeline: TimelineEvent[]): number => {
  if (!tasks || tasks.length === 0) {
    return 0;
  }
  
  let completedTasks = 0;
  let totalItems = tasks.length;
  
  // Count completed tasks
  completedTasks = tasks.filter(task => task.status === 'done').length;
  
  // If timeline is provided, include it in calculation
  if (timeline && timeline.length > 0) {
    completedTasks += timeline.filter(event => event.completed).length;
    totalItems += timeline.length;
  }
  
  return Math.round((completedTasks / totalItems) * 100);
};
