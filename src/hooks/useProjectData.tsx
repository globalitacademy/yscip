
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useProjectData = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  const [reservedProjects, setReservedProjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  
  // Load projects and assignments from localStorage
  useEffect(() => {
    // Get created projects
    const storedProjects = localStorage.getItem('createdProjects');
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        setCreatedProjects(parsedProjects);
        console.log('Loaded created projects:', parsedProjects);
      } catch (e) {
        console.error('Error parsing stored projects:', e);
      }
    }
    
    // Get reserved projects
    const storedReservations = localStorage.getItem('reservedProjects');
    if (storedReservations) {
      try {
        const parsedReservations = JSON.parse(storedReservations);
        setReservedProjects(parsedReservations);
        console.log('Loaded reserved projects:', parsedReservations);
      } catch (e) {
        console.error('Error parsing reserved projects:', e);
      }
    }
    
    // Get assignments
    const storedAssignments = localStorage.getItem('projectAssignments');
    if (storedAssignments) {
      try {
        const parsedAssignments = JSON.parse(storedAssignments);
        setAssignments(parsedAssignments);
        console.log('Loaded assignments:', parsedAssignments);
      } catch (e) {
        console.error('Error parsing assignments:', e);
      }
    }
  }, []);

  // Display user role toast when logged in
  useEffect(() => {
    if (user) {
      const roleMap: Record<string, string> = {
        'student': 'Ուսանող',
        'instructor': 'Դասախոս',
        'admin': 'Ադմինիստրատոր',
        'supervisor': 'Ղեկավար'
      };
      
      const roleName = roleMap[user.role] || user.role;
      
      toast.success(`Մուտք եք գործել որպես ${roleName}`, {
        duration: 3000,
        position: 'top-right'
      });
    }
  }, [user]);

  // Filter user's reserved projects
  const userReservedProjects = user 
    ? reservedProjects.filter(rp => rp.userId === user.id)
    : [];

  // Find actual project details for reserved projects
  const userReservedProjectDetails = userReservedProjects.map(rp => {
    const project = [...createdProjects].find(p => Number(p.id) === Number(rp.projectId));
    return { ...rp, project };
  }).filter(rp => rp.project); // Filter out any without matching project details

  return {
    user,
    createdProjects,
    reservedProjects,
    assignments,
    userReservedProjectDetails
  };
};
