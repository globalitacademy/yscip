
import { User } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';

export const getProjectAssignmentsForUser = (userId: string): number[] => {
  try {
    const assignments = localStorage.getItem('projectAssignments');
    if (!assignments) return [];
    
    const parsedAssignments = JSON.parse(assignments);
    return parsedAssignments
      .filter((a: any) => a.studentId === userId)
      .map((a: any) => Number(a.projectId));
  } catch (e) {
    console.error('Error loading project assignments:', e);
    return [];
  }
};

export const getStudentsForProject = (projectId: number): User[] => {
  try {
    const assignments = localStorage.getItem('projectAssignments');
    if (!assignments) return [];
    
    const parsedAssignments = JSON.parse(assignments);
    const studentIds = parsedAssignments
      .filter((a: any) => Number(a.projectId) === projectId)
      .map((a: any) => a.studentId);
    
    return mockUsers.filter(user => studentIds.includes(user.id));
  } catch (e) {
    console.error('Error finding students for project:', e);
    return [];
  }
};
