
import { v4 as uuidv4 } from 'uuid';

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
}

// Load project reservations from localStorage
export const loadProjectReservations = (): ProjectReservation[] => {
  const reservations = localStorage.getItem('projectReservations');
  if (reservations) {
    try {
      return JSON.parse(reservations);
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

// Request a project reservation
export const requestProjectReservation = (
  projectId: number,
  studentId: string,
  studentName: string,
  supervisorId: string
): boolean => {
  const reservations = loadProjectReservations();
  
  // Check if student already has a pending or approved reservation for this project
  const existingReservation = reservations.find(
    res => res.projectId === projectId && 
           res.studentId === studentId && 
           (res.status === 'pending' || res.status === 'approved')
  );
  
  if (existingReservation) {
    return false;
  }
  
  // Create new reservation
  const newReservation: ProjectReservation = {
    id: uuidv4(),
    projectId,
    studentId,
    studentName,
    supervisorId,
    status: 'pending',
    requestDate: new Date().toISOString()
  };
  
  reservations.push(newReservation);
  saveProjectReservations(reservations);
  
  return true;
};

// Update project reservation status
export const updateReservationStatus = (
  reservationId: string,
  status: 'approved' | 'rejected'
): boolean => {
  const reservations = loadProjectReservations();
  const index = reservations.findIndex(res => res.id === reservationId);
  
  if (index === -1) {
    return false;
  }
  
  reservations[index].status = status;
  reservations[index].responseDate = new Date().toISOString();
  
  saveProjectReservations(reservations);
  return true;
};
