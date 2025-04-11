import { ProjectTheme, TimelineEvent, Task } from '@/data/projectThemes';
import { ProjectReservation } from '@/types/project';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { loadProjectReservations, saveProjectReservations } from '@/utils/projectUtils';

/**
 * Creates a new project in the database
 */
export async function createProject(project: Partial<ProjectTheme>, userId?: string): Promise<ProjectTheme> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get existing projects from localStorage or create empty array
  const projectsJson = localStorage.getItem('projects');
  const projects: ProjectTheme[] = projectsJson ? JSON.parse(projectsJson) : [];
  
  // Create new project with default values
  const newProject: ProjectTheme = {
    id: projects.length + 1,
    title: project.title || 'New Project',
    description: project.description || '',
    category: project.category || 'Web Development',
    image: project.image || '/placeholder.svg',
    complexity: project.complexity || 'Միջին',
    technologies: project.technologies || project.techStack || [],
    duration: project.duration || '2-3 շաբաթ',
    createdBy: project.createdBy || userId || '',
    goal: project.goal || '',
    resources: project.resources || [],
    links: project.links || [],
    requirements: project.requirements || [],
    difficulty: project.difficulty || 'Միջին',
    implementationSteps: project.implementationSteps || [],
    organizationName: project.organizationName || '',
    detailedDescription: project.detailedDescription || '',
    isPublic: project.isPublic || project.is_public || false,
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add new project to array
  projects.push(newProject);
  
  // Save updated array to localStorage
  localStorage.setItem('projects', JSON.stringify(projects));
  
  return newProject;
}

/**
 * Mock function to simulate getting a project from the database by ID
 */
export async function getProjectById(projectId: number): Promise<ProjectTheme | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get projects from localStorage
  const projectsJson = localStorage.getItem('projects');
  
  if (!projectsJson) {
    return null;
  }
  
  const projects: ProjectTheme[] = JSON.parse(projectsJson);
  const project = projects.find(p => p.id === projectId);
  
  return project || null;
}

/**
 * Adds a new timeline event to a project
 */
export async function addTimelineEvent(
  projectId: number,
  event: Omit<TimelineEvent, 'id'>
): Promise<TimelineEvent> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Create new event with UUID
  const newEvent: TimelineEvent = {
    id: uuidv4(),
    ...event,
    isCompleted: false
  };
  
  // Get existing timeline from localStorage or create empty array
  const timelineJson = localStorage.getItem(`project-${projectId}-timeline`);
  const timeline: TimelineEvent[] = timelineJson ? JSON.parse(timelineJson) : [];
  
  // Add new event to array
  timeline.push(newEvent);
  
  // Save updated array to localStorage
  localStorage.setItem(`project-${projectId}-timeline`, JSON.stringify(timeline));
  
  return newEvent;
}

/**
 * Marks a timeline event as completed
 */
export async function completeTimelineEvent(
  projectId: number,
  eventId: string
): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get existing timeline from localStorage
  const timelineJson = localStorage.getItem(`project-${projectId}-timeline`);
  
  if (!timelineJson) {
    throw new Error('Timeline not found');
  }
  
  const timeline: TimelineEvent[] = JSON.parse(timelineJson);
  const updatedTimeline = timeline.map(event => {
    if (event.id === eventId) {
      return { ...event, isCompleted: true };
    }
    return event;
  });
  
  // Save updated array to localStorage
  localStorage.setItem(`project-${projectId}-timeline`, JSON.stringify(updatedTimeline));
}

/**
 * Retrieves the timeline for a project
 */
export async function getProjectTimeline(projectId: number): Promise<TimelineEvent[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get existing timeline from localStorage or return empty array
  const timelineJson = localStorage.getItem(`project-${projectId}-timeline`);
  return timelineJson ? JSON.parse(timelineJson) : [];
}

/**
 * Adds a new task to a project
 */
export async function addTask(
  projectId: number,
  task: Omit<Task, 'id'>
): Promise<Task> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Create new task with UUID
  const newTask: Task = {
    id: uuidv4(),
    ...task
  };
  
  // Get existing tasks from localStorage or create empty array
  const tasksJson = localStorage.getItem(`project-${projectId}-tasks`);
  const tasks: Task[] = tasksJson ? JSON.parse(tasksJson) : [];
  
  // Add new task to array
  tasks.push(newTask);
  
  // Save updated array to localStorage
  localStorage.setItem(`project-${projectId}-tasks`, JSON.stringify(tasks));
  
  return newTask;
}

/**
 * Updates the status of a task
 */
export async function updateTaskStatus(
  projectId: number,
  taskId: string,
  status: Task['status']
): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get existing tasks from localStorage
  const tasksJson = localStorage.getItem(`project-${projectId}-tasks`);
  
  if (!tasksJson) {
    throw new Error('Tasks not found');
  }
  
  const tasks: Task[] = JSON.parse(tasksJson);
  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, status };
    }
    return task;
  });
  
  // Save updated array to localStorage
  localStorage.setItem(`project-${projectId}-tasks`, JSON.stringify(updatedTasks));
}

/**
 * Retrieves the tasks for a project
 */
export async function getProjectTasks(projectId: number): Promise<Task[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get existing tasks from localStorage or return empty array
  const tasksJson = localStorage.getItem(`project-${projectId}-tasks`);
  return tasksJson ? JSON.parse(tasksJson) : [];
}

/**
 * Updates a project's status
 */
export async function changeProjectStatus(
  projectId: number,
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected',
  feedback: string
): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get projects from localStorage
  const projectsJson = localStorage.getItem('projects');
  
  if (!projectsJson) {
    throw new Error('Projects not found');
  }
  
  const projects: ProjectTheme[] = JSON.parse(projectsJson);
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    throw new Error('Project not found');
  }
  
  // Save status separately to avoid cluttering the project object
  localStorage.setItem(`project-${projectId}-status`, status);
  localStorage.setItem(`project-${projectId}-feedback`, feedback);
}

/**
 * Gets a project's status
 */
export async function getProjectStatus(
  projectId: number
): Promise<'not_submitted' | 'pending' | 'approved' | 'rejected'> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get status from localStorage or return default
  const status = localStorage.getItem(`project-${projectId}-status`);
  return (status as 'not_submitted' | 'pending' | 'approved' | 'rejected') || 'not_submitted';
}

/**
 * Update project details
 */
export async function updateProject(
  projectId: number,
  updates: Partial<ProjectTheme>
): Promise<ProjectTheme> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get existing projects
  const projectsJson = localStorage.getItem('projects');
  
  if (!projectsJson) {
    throw new Error('Projects not found');
  }
  
  const projects: ProjectTheme[] = JSON.parse(projectsJson);
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    throw new Error('Project not found');
  }
  
  // Create updated project
  const currentProject = projects[projectIndex];
  const updatedProject = {
    ...currentProject,
    ...updates,
    // Handle nested properties
    difficulty: updates.difficulty !== undefined ? updates.difficulty : currentProject.difficulty,
    createdBy: updates.createdBy !== undefined ? updates.createdBy : currentProject.createdBy,
    goal: updates.goal !== undefined ? updates.goal : currentProject.goal,
    resources: updates.resources !== undefined ? updates.resources : currentProject.resources,
    links: updates.links !== undefined ? updates.links : currentProject.links,
    implementationSteps: updates.implementationSteps !== undefined ? updates.implementationSteps : currentProject.implementationSteps,
    requirements: updates.requirements !== undefined ? updates.requirements : currentProject.requirements
  };
  
  // Update project in array
  projects[projectIndex] = updatedProject;
  
  // Save updated array to localStorage
  localStorage.setItem('projects', JSON.stringify(projects));
  
  return updatedProject;
}

/**
 * Reserve a project
 */
export async function reserveProject(reservation: Omit<ProjectReservation, 'id' | 'reservedAt'>): Promise<{ success: boolean; message: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    // Get existing reservations
    const reservations = loadProjectReservations();
    
    // Check if project is already reserved by this user
    const existingReservation = reservations.find(
      r => r.projectId === reservation.projectId && r.studentId === reservation.studentId
    );
    
    if (existingReservation) {
      return {
        success: false,
        message: 'Դուք արդեն պահել եք այս նախագիծը'
      };
    }
    
    // Add new reservation with ID
    const newReservation = {
      ...reservation,
      id: uuidv4(),
      reservedAt: new Date().toISOString(),
      studentId: reservation.studentId || reservation.userId
    };
    
    reservations.push(newReservation as ProjectReservation);
    
    // Save updated reservations
    saveProjectReservations(reservations);
    
    return {
      success: true,
      message: 'Նախագիծը հաջողությամբ պահպանվել է'
    };
  } catch (error) {
    console.error('Error reserving project:', error);
    return {
      success: false,
      message: 'Սխալ նախագիծը պահելիս'
    };
  }
}

/**
 * Get projects reserved for a specific supervisor
 */
export async function getSupervisorReservations(supervisorId: string): Promise<ProjectReservation[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    // Get all reservations
    const reservations = loadProjectReservations();
    
    // Filter for this supervisor
    return reservations.filter(r => r.supervisorId === supervisorId);
  } catch (error) {
    console.error('Error getting supervisor reservations:', error);
    return [];
  }
}

/**
 * Approve or reject a project reservation
 */
export async function updateReservationStatus(
  reservationId: string,
  status: 'approved' | 'rejected',
  feedback?: string
): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    // Get existing reservations
    const reservations = loadProjectReservations();
    
    // Find and update the reservation
    const updatedReservations = reservations.map(r => {
      if (r.id === reservationId) {
        return {
          ...r,
          status,
          feedback: feedback || r.feedback,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    });
    
    // Save updated reservations
    saveProjectReservations(updatedReservations);
    
    return true;
  } catch (error) {
    console.error('Error updating reservation status:', error);
    return false;
  }
}

/**
 * Get the reservation status for a project and user
 */
export async function getUserProjectReservation(
  projectId: number,
  userId: string
): Promise<ProjectReservation | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    // Get all reservations
    const reservations = loadProjectReservations();
    
    // Find the reservation for this project and user
    const reservation = reservations.find(
      r => Number(r.projectId) === projectId && r.studentId === userId
    );
    
    return reservation || null;
  } catch (error) {
    console.error('Error getting user project reservation:', error);
    return null;
  }
}
