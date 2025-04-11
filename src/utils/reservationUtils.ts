
import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme } from '@/data/projectThemes';

export type ProjectReservation = {
  id: string;
  projectId: number;
  userId: string;
  projectTitle: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  supervisorId: string;
  instructorId?: string;
  feedback?: string;
  studentId: string;
  studentName?: string;
  requestDate?: string;
  responseDate?: string;
};

export function loadProjectReservations(): ProjectReservation[] {
  const reservationsJson = localStorage.getItem('projectReservations');
  return reservationsJson ? JSON.parse(reservationsJson) : [];
}

export function saveProjectReservations(reservations: ProjectReservation[]): void {
  localStorage.setItem('projectReservations', JSON.stringify(reservations));
}

export function isProjectReservedByUser(
  projectId: number,
  userId: string,
  reservations: ProjectReservation[] = loadProjectReservations()
): boolean {
  return reservations.some(reservation => 
    reservation.projectId === projectId && 
    (reservation.userId === userId || reservation.studentId === userId)
  );
}

export function saveProjectReservation(
  project: ProjectTheme,
  userId: string,
  supervisorId: string
): boolean {
  try {
    const reservations = loadProjectReservations();
    
    // Check if already reserved by this user
    if (isProjectReservedByUser(project.id, userId, reservations)) {
      return false;
    }
    
    // Add new reservation
    const newReservation: ProjectReservation = {
      id: uuidv4(),
      projectId: project.id,
      userId: userId,
      studentId: userId, // Ensure studentId is always set
      projectTitle: project.title,
      timestamp: new Date().toISOString(),
      status: 'pending',
      supervisorId: supervisorId,
      requestDate: new Date().toISOString()
    };
    
    reservations.push(newReservation);
    saveProjectReservations(reservations);
    return true;
  } catch (error) {
    console.error('Error saving project reservation:', error);
    return false;
  }
}

export function updateReservationStatus(
  reservationId: string,
  status: 'approved' | 'rejected',
  feedback: string = ''
): ProjectReservation[] {
  const reservations = loadProjectReservations();
  
  const updatedReservations = reservations.map(res => {
    if (res.id === reservationId) {
      return {
        ...res,
        status,
        feedback,
        responseDate: new Date().toISOString()
      };
    }
    return res;
  });
  
  saveProjectReservations(updatedReservations);
  return updatedReservations;
}

export function getAvailableSupervisors() {
  // Mock data for supervisors
  return [
    { id: 'sup1', name: 'Տիգրան Պետրոսյան', role: 'supervisor' },
    { id: 'sup2', name: 'Անահիտ Հակոբյան', role: 'supervisor' },
    { id: 'sup3', name: 'Սարգիս Գևորգյան', role: 'supervisor' }
  ];
}
