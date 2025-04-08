
import { useState, useEffect } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { loadProjectReservations } from '@/utils/projectUtils';
import { ProjectReservation } from '@/types/project';

export const useProjectState = (
  projectId: number,
  initialProject: ProjectTheme,
  user: any
) => {
  // Basic project state
  const [project, setProject] = useState<ProjectTheme>(initialProject);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectStatus, setProjectStatus] = useState<'not_submitted' | 'pending' | 'approved' | 'rejected'>('not_submitted');
  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [projectReservationsState, setProjectReservationsState] = useState<ProjectReservation[]>([]);
  const [showSupervisorDialog, setShowSupervisorDialog] = useState<boolean>(false);

  // Default timeline and tasks
  useEffect(() => {
    // Initialize with some default timeline events
    const defaultTimeline: TimelineEvent[] = [
      { id: '1', title: 'Նախագծի մեկնարկ', description: 'Նախագծի պահանջների ուսումնասիրություն', date: new Date().toISOString().split('T')[0], completed: true },
      { id: '2', title: 'Նախնական նախագիծ', description: 'Նախնական պլանի ստեղծում', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false }
    ];
    
    // Initialize with some default tasks
    const defaultTasks: Task[] = [
      { id: '1', title: 'Պահանջների վերլուծություն', description: 'Վերլուծել և նշել բոլոր պահանջները', status: 'completed' },
      { id: '2', title: 'UI/UX դիզայն', description: 'Ստեղծել բոլոր էջերի դիզայնը', status: 'in-progress' },
      { id: '3', title: 'Ծրագրավորում', description: 'Frontend և Backend իրականացում', status: 'todo' }
    ];
    
    setTimeline(defaultTimeline);
    setTasks(defaultTasks);
    
    // Check if project is reserved by current user
    const reservations = loadProjectReservations();
    setProjectReservationsState(reservations);
    
    const isProjectReserved = reservations.some(
      res => res.projectId === projectId && 
      res.studentId === user?.id && 
      res.status === 'approved'
    );
    
    setIsReserved(isProjectReserved);
    
    // Set project status based on reservations
    const userReservation = reservations.find(
      res => res.projectId === projectId && res.studentId === user?.id
    );
    
    if (userReservation) {
      switch (userReservation.status) {
        case 'pending':
          setProjectStatus('pending');
          break;
        case 'approved':
          setProjectStatus('approved');
          break;
        case 'rejected':
          setProjectStatus('rejected');
          break;
        default:
          setProjectStatus('not_submitted');
      }
    }
  }, [projectId, user?.id]);

  return {
    project,
    setProject,
    timeline,
    setTimeline,
    tasks,
    setTasks,
    projectStatus,
    setProjectStatus,
    isReserved,
    setIsReserved,
    projectReservationsState,
    setProjectReservationsState,
    showSupervisorDialog,
    setShowSupervisorDialog
  };
};
