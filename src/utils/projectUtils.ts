
import { toast } from '@/components/ui/use-toast';
import { ProjectReservation } from '@/types/project';
import { ProjectTheme, TimelineEvent, Task } from '@/data/projectThemes';
import { v4 as uuidv4 } from 'uuid';

// Calculate project progress
export const calculateProjectProgress = (tasks: Task[], timeline: TimelineEvent[]): number => {
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;
  const completedEvents = timeline.filter(event => event.completed).length;
  const totalEvents = timeline.length;
  
  return totalTasks + totalEvents > 0 
    ? Math.round(((completedTasks + completedEvents) / (totalTasks + totalEvents)) * 100) 
    : 0;
};

// Load project reservations from local storage
export const loadProjectReservations = (): ProjectReservation[] => {
  const reservedProjects = localStorage.getItem('reservedProjects');
  if (reservedProjects) {
    try {
      return JSON.parse(reservedProjects);
    } catch (e) {
      console.error('Error parsing reserved projects:', e);
    }
  }
  return [];
};

// Check if a project is reserved by a user
export const isProjectReservedByUser = (
  projectId: number | null, 
  userId: string | undefined,
  reservations: ProjectReservation[]
): boolean => {
  if (!projectId || !userId) return false;
  
  const reservation = reservations.find(res => 
    res.projectId === projectId && res.userId === userId
  );
  
  // Project is only considered reserved if the supervisor has approved
  return !!reservation && reservation.status === 'approved';
};

// Save a new project reservation
export const saveProjectReservation = (
  project: ProjectTheme | null,
  userId: string,
  supervisorId?: string,
  instructorId?: string
): void => {
  if (!project) return;
  
  const reservations = loadProjectReservations();
  
  // Check if reservation already exists
  const existingReservation = reservations.find(
    res => res.projectId === project.id && res.userId === userId
  );
  
  if (existingReservation) {
    toast({
      title: "Արդեն ամրագրված է",
      description: "Դուք արդեն ամրագրել եք այս պրոեկտը։ Խնդրում ենք սպասել հաստատման։",
    });
    return;
  }
  
  // Add new reservation
  const newReservation: ProjectReservation = {
    projectId: project.id,
    userId: userId,
    projectTitle: project.title,
    timestamp: new Date().toISOString(),
    status: 'pending',
    supervisorId,
    instructorId
  };
  
  reservations.push(newReservation);
  localStorage.setItem('reservedProjects', JSON.stringify(reservations));
  
  toast({
    title: "Հարցումն ուղարկված է",
    description: `Ձեր հարցումն ուղարկվել է ղեկավարին։ Խնդրում ենք սպասել հաստատման։`,
  });
};

// Update reservation status
export const updateReservationStatus = (
  projectId: number,
  userId: string | undefined,
  userRole: string,
  status: 'approved' | 'rejected',
  feedback?: string
): ProjectReservation[] => {
  if (!userId || (userRole !== 'supervisor' && userRole !== 'instructor' && userRole !== 'project_manager')) {
    return loadProjectReservations();
  }
  
  const reservations = loadProjectReservations();
  
  const updatedReservations = reservations.map(res => {
    if (res.projectId === projectId) {
      if ((userRole === 'supervisor' || userRole === 'project_manager') && res.supervisorId === userId) {
        return { ...res, status, ...(feedback ? { feedback } : {}) };
      } else if (userRole === 'instructor' && res.instructorId === userId) {
        return { ...res, status, ...(feedback ? { feedback } : {}) };
      }
    }
    return res;
  });
  
  localStorage.setItem('reservedProjects', JSON.stringify(updatedReservations));
  
  toast({
    title: status === 'approved' ? "Հաստատված" : "Մերժված",
    description: status === 'approved' 
      ? "Ուսանողի հարցումը հաստատվել է։" 
      : "Ուսանողի հարցումը մերժվել է։",
  });
  
  return updatedReservations;
};

// Generate sample timeline events
export const generateSampleTimeline = (): TimelineEvent[] => {
  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - 5);
  
  return [
    {
      id: uuidv4(),
      title: 'Պրոեկտի մեկնարկ',
      date: startDate.toISOString().split('T')[0],
      description: 'Նախագծի պահանջների հստակեցում և աշխատանքային պլանի կազմում',
      completed: true
    },
    {
      id: uuidv4(),
      title: 'Նախնական տարբերակի ներկայացում',
      date: now.toISOString().split('T')[0],
      description: 'Նախագծի նախնական տարբերակի ներկայացում և քննարկում',
      completed: false
    }
  ];
};

// Generate sample tasks
export const generateSampleTasks = (userId: string): Task[] => {
  const now = new Date();
  const dueDate = new Date();
  dueDate.setDate(now.getDate() + 7);
  
  return [
    {
      id: uuidv4(),
      title: 'Պահանջների վերլուծություն',
      description: 'Հավաքել և վերլուծել նախագծի բոլոր պահանջները',
      status: 'done',
      assignedTo: userId,
      dueDate: now.toISOString().split('T')[0],
      createdBy: 'instructor1'
    },
    {
      id: uuidv4(),
      title: 'Նախագծի կառուցվածքի մշակում',
      description: 'Ստեղծել նախագծի հիմնական կառուցվածքը և ճարտարապետությունը',
      status: 'in-progress',
      assignedTo: userId,
      dueDate: dueDate.toISOString().split('T')[0],
      createdBy: 'instructor1'
    }
  ];
};

// Get supervisors from mock users
export const getAvailableSupervisors = () => {
  // For demonstration purposes, we'll return hardcoded supervisors
  return [
    { id: 'supervisor1', name: 'Արամ Հակոբյան', role: 'supervisor', avatar: '/placeholder.svg' },
    { id: 'supervisor2', name: 'Լևոն Մարտիրոսյան', role: 'supervisor', avatar: '/placeholder.svg' },
    { id: 'supervisor3', name: 'Աննա Պողոսյան', role: 'supervisor', avatar: '/placeholder.svg' }
  ];
};
