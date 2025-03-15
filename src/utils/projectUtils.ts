import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { getUsersByRole } from '@/data/userRoles';

// Project reservation types
export interface ProjectReservation {
  id: string;
  projectId: number;
  studentId: string;
  studentName: string;
  supervisorId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  responseDate?: string;
  userId: string;  // Required field
  projectTitle: string; // Required field
  timestamp: string;    // Required field
  feedback?: string;
  instructorId?: string;
}

// Calculate project progress based on tasks and timeline
export const calculateProjectProgress = (tasks: Task[], timeline: TimelineEvent[]): number => {
  if (tasks.length === 0 && timeline.length === 0) return 0;
  
  let completedItems = 0;
  let totalItems = 0;
  
  // Count completed tasks
  if (tasks.length > 0) {
    totalItems += tasks.length;
    completedItems += tasks.filter(task => task.status === 'done' || task.status === 'done').length;
  }
  
  // Count completed timeline events
  if (timeline.length > 0) {
    totalItems += timeline.length;
    completedItems += timeline.filter(event => event.completed).length;
  }
  
  return Math.round((completedItems / totalItems) * 100);
};

// Generate sample timeline events for demo
export const generateSampleTimeline = (): TimelineEvent[] => {
  const now = new Date();
  const oneWeekLater = new Date(now);
  oneWeekLater.setDate(now.getDate() + 7);
  
  const twoWeeksLater = new Date(now);
  twoWeeksLater.setDate(now.getDate() + 14);
  
  return [
    {
      id: uuidv4(),
      title: 'Նախագծի մեկնարկ',
      date: now.toISOString().split('T')[0],
      description: 'Նախագծի պահանջների քննարկում և պլանավորում',
      completed: true
    },
    {
      id: uuidv4(),
      title: 'Ծրագրային պահանջների կազմում',
      date: oneWeekLater.toISOString().split('T')[0],
      description: 'Ծրագրային պահանջների վերլուծություն և փաստաթղթավորում',
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Նախնական նախատիպի ստեղծում',
      date: twoWeeksLater.toISOString().split('T')[0],
      description: 'Նախագծի նախնական տարբերակի մշակում',
      completed: false
    }
  ];
};

// Generate sample tasks for demo
export const generateSampleTasks = (userId: string): Task[] => {
  return [
    {
      id: uuidv4(),
      title: 'Տեխնիկական առաջադրանքի կազմում',
      description: 'Նախագծի տեխնիկական առաջադրանքի մշակում և կազմում',
      status: 'done',
      assignedTo: userId
    },
    {
      id: uuidv4(),
      title: 'Ճարտարապետության մշակում',
      description: 'Նախագծի ճարտարապետության նախագծում և սխեմատիկ պատկերում',
      status: 'in-progress',
      assignedTo: userId
    },
    {
      id: uuidv4(),
      title: 'UI/UX դիզայն',
      description: 'Օգտագործողի միջերեսի նախատիպի մշակում',
      status: 'todo',
      assignedTo: userId
    }
  ];
};

// Load project reservations from localStorage
export const loadProjectReservations = (): ProjectReservation[] => {
  const reservations = localStorage.getItem('projectReservations');
  if (reservations) {
    try {
      const parsed = JSON.parse(reservations);
      // Add compatibility fields if they don't exist
      return parsed.map((res: any) => ({
        ...res,
        userId: res.userId || res.studentId,
        projectTitle: res.projectTitle || `Project #${res.projectId}`,
        timestamp: res.timestamp || res.requestDate,
        studentId: res.studentId || res.userId,
        studentName: res.studentName || "Student",
        requestDate: res.requestDate || res.timestamp,
        id: res.id || uuidv4()
      }));
    } catch (e) {
      console.error('Error parsing project reservations:', e);
    }
  }
  return [];
};

// Save project reservations to localStorage
export const saveProjectReservations = (reservations: ProjectReservation[]) => {
  localStorage.setItem('projectReservations', JSON.stringify(reservations));
};

// Check if project is reserved by user
export const isProjectReservedByUser = (
  projectId: number,
  userId: string,
  reservations: ProjectReservation[]
): boolean => {
  return reservations.some(
    res => res.projectId === projectId && 
           (res.studentId === userId || res.userId === userId) && 
           (res.status === 'pending' || res.status === 'approved')
  );
};

// Save project reservation
export const saveProjectReservation = (
  project: ProjectTheme,
  studentId: string,
  supervisorId: string
): boolean => {
  const reservations = loadProjectReservations();
  
  // Check if student already has a pending or approved reservation for this project
  const existingReservation = reservations.find(
    res => res.projectId === project.id && 
           (res.studentId === studentId || res.userId === studentId) && 
           (res.status === 'pending' || res.status === 'approved')
  );
  
  if (existingReservation) {
    return false;
  }
  
  const now = new Date().toISOString();
  
  // Create new reservation
  const newReservation: ProjectReservation = {
    id: uuidv4(),
    projectId: project.id,
    studentId: studentId,
    studentName: "Student", // In a real app, get name from user profile
    supervisorId: supervisorId,
    status: 'pending',
    requestDate: now,
    // Add compatibility fields
    userId: studentId,
    projectTitle: project.title,
    timestamp: now
  };
  
  reservations.push(newReservation);
  saveProjectReservations(reservations);
  
  return true;
};

// Update project reservation status
export const updateReservationStatus = (
  reservationId: string,
  status: 'approved' | 'rejected',
  feedback?: string
): ProjectReservation[] => {
  const reservations = loadProjectReservations();
  const index = reservations.findIndex(res => res.id === reservationId);
  
  if (index === -1) {
    return reservations;
  }
  
  reservations[index].status = status;
  reservations[index].responseDate = new Date().toISOString();
  if (feedback) {
    reservations[index].feedback = feedback;
  }
  
  saveProjectReservations(reservations);
  return reservations;
};

// Get available supervisors for selection
export const getAvailableSupervisors = () => {
  return getUsersByRole('supervisor').concat(getUsersByRole('project_manager')).map(supervisor => ({
    id: supervisor.id,
    name: supervisor.name,
    avatar: supervisor.avatar || '',
    role: supervisor.role
  }));
};
