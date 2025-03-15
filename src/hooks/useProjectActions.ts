
import { v4 as uuidv4 } from 'uuid';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { 
  saveProjectReservation, 
  updateReservationStatus, 
  loadProjectReservations
} from '@/utils/projectUtils';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { User } from '@/types/user';

export const useProjectActions = (
  project: any,
  user: User | null,
  timeline: TimelineEvent[],
  setTimeline: React.Dispatch<React.SetStateAction<TimelineEvent[]>>,
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setProjectStatus: React.Dispatch<React.SetStateAction<'not_submitted' | 'pending' | 'approved' | 'rejected'>>,
  setIsReserved: React.Dispatch<React.SetStateAction<boolean>>,
  setProjectReservationsState: React.Dispatch<React.SetStateAction<any[]>>,
  setShowSupervisorDialog: React.Dispatch<React.SetStateAction<boolean>>,
  selectedSupervisor: string | null
) => {
  // Get permissions based on user role
  const permissions = useProjectPermissions(user?.role);

  const addTimelineEvent = (event: Omit<TimelineEvent, 'id'>) => {
    if (!permissions.canAddTimeline) return;
    
    const newEvent = { ...event, id: uuidv4() };
    setTimeline(prev => [...prev, newEvent]);
  };

  const completeTimelineEvent = (eventId: string) => {
    if (!permissions.canApproveTimelineEvents) return;
    
    setTimeline(prev => prev.map(event => 
      event.id === eventId ? { ...event, completed: true } : event
    ));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    if (!permissions.canAddTasks) return;
    
    const newTask = { ...task, id: uuidv4() };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    // Student can only update their assigned tasks
    if (user?.role === 'student') {
      const task = tasks.find(t => t.id === taskId);
      if (!task || task.assignedTo !== user.id) return;
    }
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const submitProject = (feedback: string) => {
    if (!permissions.canSubmitProject) return;
    
    setProjectStatus('pending');
    console.log("Project submitted with feedback:", feedback);
  };

  const approveProject = (feedback: string) => {
    if (!permissions.canApproveProject) return;
    
    setProjectStatus('approved');
    console.log("Project approved with feedback:", feedback);
  };

  const rejectProject = (feedback: string) => {
    if (!permissions.canApproveProject) return;
    
    setProjectStatus('rejected');
    console.log("Project rejected with feedback:", feedback);
  };

  const openSupervisorDialog = () => {
    if (!user || user.role !== 'student' || !project) return;
    setShowSupervisorDialog(true);
  };

  const closeSupervisorDialog = () => {
    setShowSupervisorDialog(false);
  };

  const selectSupervisor = (supervisorId: string) => {
    // This function is handled by the parent component
  };

  const reserveProject = () => {
    // Only students can reserve projects and must select a supervisor
    if (!user || user.role !== 'student' || !project || !selectedSupervisor) return;
    
    // Save reservation in localStorage with pending status
    const success = saveProjectReservation(project, user.id, selectedSupervisor);
    
    // Update local state
    if (success) {
      setIsReserved(true);
      setProjectReservationsState(loadProjectReservations());
      setShowSupervisorDialog(false);
    }
  };

  const approveReservation = (reservationId: string) => {
    const updatedReservations = updateReservationStatus(reservationId, 'approved');
    setProjectReservationsState(updatedReservations);
  };

  const rejectReservation = (reservationId: string, feedback: string) => {
    const updatedReservations = updateReservationStatus(reservationId, 'rejected', feedback);
    setProjectReservationsState(updatedReservations);
  };

  const getReservationStatus = (): 'pending' | 'approved' | 'rejected' | null => {
    if (!project?.id || !user) return null;
    
    const reservation = loadProjectReservations().find(
      res => res.projectId === project.id && (res.userId === user.id || res.studentId === user.id)
    );
    
    return reservation ? reservation.status : null;
  };

  return {
    addTimelineEvent,
    completeTimelineEvent,
    addTask,
    updateTaskStatus,
    submitProject,
    approveProject,
    rejectProject,
    openSupervisorDialog,
    closeSupervisorDialog,
    reserveProject,
    approveReservation,
    rejectReservation,
    getReservationStatus
  };
};
