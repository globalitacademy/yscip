
import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme } from '@/data/projectThemes';
import { getUsersByRole } from '@/data/userRoles';

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
