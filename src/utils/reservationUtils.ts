
import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme } from '@/data/projectThemes';
import { getUsersByRole } from '@/data/userRoles';

// Project reservation types
export interface ProjectReservation {
  id: string;
  projectId: number;
  studentId: string;  // Required field
  studentName: string;
  supervisorId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  responseDate?: string;
  userId: string;      // Required field
  projectTitle: string; // Required field
  timestamp: string;    // Required field
  feedback?: string;
  instructorId?: string;
}

// Load project reservations from localStorage
export const loadProjectReservations = (): ProjectReservation[] => {
  const reservations = localStorage.getItem('projectReservations');
  if (reservations) {
    try {
      const parsed = JSON.parse(reservations);
      // Add compatibility fields if they don't exist
      return parsed.map((res: any) => ({
        ...res,
        userId: res.userId || res.studentId || '',
        projectTitle: res.projectTitle || `Project #${res.projectId}`,
        timestamp: res.timestamp || res.requestDate || '',
        studentId: res.studentId || res.userId || '',
        studentName: res.studentName || "Student",
        requestDate: res.requestDate || res.timestamp || '',
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

// Get reservation by ID
export const getReservationById = (reservationId: string): ProjectReservation | undefined => {
  const reservations = loadProjectReservations();
  return reservations.find(res => res.id === reservationId);
};

// Get reservation by project ID
export const getReservationByProjectId = (projectId: number, userId?: string): ProjectReservation | undefined => {
  const reservations = loadProjectReservations();
  return reservations.find(res => 
    res.projectId === projectId && 
    (!userId || res.userId === userId || res.studentId === userId)
  );
};
