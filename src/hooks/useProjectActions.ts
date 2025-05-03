
import { v4 as uuidv4 } from 'uuid';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { 
  saveProjectReservation, 
  updateReservationStatus, 
  loadProjectReservations
} from '@/utils/projectUtils';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { User } from '@/types/user';
import { TaskStatus } from '@/utils/taskUtils';
import { toast } from 'sonner';
import { getReservationById, getReservationByProjectId } from '@/utils/reservationUtils';
import { ProjectMember } from '@/contexts/project/types';

export const useProjectActions = (
  project: any,
  user: User | null,
  timeline: TimelineEvent[],
  setTimeline: (timeline: TimelineEvent[]) => void,
  tasks: Task[],
  setTasks: (tasks: Task[]) => void,
  setProjectStatus: (status: 'not_submitted' | 'pending' | 'approved' | 'rejected') => void,
  setIsReserved: (isReserved: boolean) => void,
  setProjectReservations: (reservations: any[]) => void,
  setShowSupervisorDialog: (show: boolean) => void,
  selectedSupervisor: string | null,
  setOrganization: React.Dispatch<React.SetStateAction<{
    id: string;
    name: string;
    website: string;
    logo: string;
  } | null>>,
  setProjectMembers: React.Dispatch<React.SetStateAction<ProjectMember[]>>
) => {
  // Get permissions based on user role
  const permissions = useProjectPermissions(user?.role);

  const addTimelineEvent = (event: Omit<TimelineEvent, 'id'>) => {
    if (!permissions.canAddTimeline) return;
    
    const newEvent = { ...event, id: uuidv4() };
    setTimeline([...timeline, newEvent]);
  };

  const completeTimelineEvent = (eventId: string) => {
    if (!permissions.canApproveTimelineEvents) return;
    
    setTimeline(timeline.map(event => 
      event.id === eventId ? { ...event, completed: true } : event
    ));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    if (!permissions.canAddTasks) return;
    
    const newTask = { ...task, id: uuidv4() };
    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    // Student can only update their assigned tasks
    if (user?.role === 'student') {
      const task = tasks.find(t => t.id === taskId);
      if (!task || task.assignedTo !== user.id) return;
    }
    
    setTasks(tasks.map(task => 
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
      setProjectReservations(loadProjectReservations());
      setShowSupervisorDialog(false);
    }
  };

  const approveReservation = (reservationId: string) => {
    const updatedReservations = updateReservationStatus(reservationId, 'approved');
    setProjectReservations(updatedReservations);
  };

  const rejectReservation = (reservationId: string, feedback: string) => {
    const updatedReservations = updateReservationStatus(reservationId, 'rejected', feedback);
    setProjectReservations(updatedReservations);
  };

  const getReservationStatus = (): 'pending' | 'approved' | 'rejected' | null => {
    if (!project?.id || !user) return null;
    
    const reservation = loadProjectReservations().find(
      res => res.projectId === project.id && (res.userId === user.id || res.studentId === user.id)
    );
    
    return reservation ? reservation.status : null;
  };

  const updateOrganization = async (orgData: {
    name: string;
    website?: string;
    logo?: string;
  }) => {
    console.log('Updating organization:', orgData);
    
    if (!project) return false;
    
    // Update the organization data
    const updatedOrg = {
      id: 'org-1', // Use a default ID since it's not provided in the parameter
      name: orgData.name,
      website: orgData.website || 'https://example.com',
      logo: orgData.logo || '/placeholder.svg'
    };
    
    setOrganization(updatedOrg);
    
    // In a real app, you would persist this to the database
    toast.success('Կազմակերպության տվյալները թարմացվել են');
    return true;
  };

  const updateProjectMembers = async (members: ProjectMember[]): Promise<boolean> => {
    try {
      console.log('Updating project members:', members);
      if (!project) return false;
      
      // Update local state
      setProjectMembers(members);
      
      // In a real app, you would persist this to the database
      toast.success('Նախագծի մասնակիցները հաջողությամբ թարմացվել են');
      return true;
    } catch (error) {
      console.error('Error updating project members:', error);
      toast.error('Նախագծի մասնակիցների թարմացման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
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
    getReservationStatus,
    updateOrganization,
    updateProjectMembers
  };
};
