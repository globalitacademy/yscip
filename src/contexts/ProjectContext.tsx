
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProjectState } from '@/hooks/useProjectState';
import { useProjectActions } from '@/hooks/useProjectActions';
import { useAuth } from '@/contexts/AuthContext';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { ProjectReservation } from '@/types/project';
import { calculateProjectProgress } from '@/utils/projectProgressUtils';
import { toast } from 'sonner';
import * as projectManagementService from '@/services/projectManagementService';

interface ProjectContextType {
  projectId: number;
  project: any;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  canEdit: boolean;
  timeline: TimelineEvent[];
  tasks: Task[];
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  completeTimelineEvent: (eventId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  submitProject: (feedback: string) => void;
  approveProject: (feedback: string) => void;
  rejectProject: (feedback: string) => void;
  reserveProject: () => void;
  isReserved: boolean;
  projectMembers: any[];
  projectReservations: ProjectReservation[];
  approveReservation: (reservationId: string) => void;
  rejectReservation: (reservationId: string, feedback: string) => void;
  projectProgress: number;
  openSupervisorDialog: () => void;
  closeSupervisorDialog: () => void;
  showSupervisorDialog: boolean;
  selectedSupervisor: string | null;
  selectSupervisor: (supervisorId: string) => void;
  getReservationStatus: () => 'pending' | 'approved' | 'rejected' | null;
  updateProject: (updates: Partial<any>) => Promise<boolean>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: React.ReactNode;
  projectId: number;
  initialProject: any;
  canEdit?: boolean;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ 
  children, 
  projectId, 
  initialProject,
  canEdit = false 
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [projectMembers, setProjectMembers] = useState<any[]>([
    { id: 'supervisor1', name: 'Արամ Հակոբյան', role: 'ղեկավար', avatar: '/placeholder.svg' },
    { id: 'student1', name: 'Գագիկ Պետրոսյան', role: 'ուսանող', avatar: '/placeholder.svg' }
  ]);

  const {
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
  } = useProjectState(projectId, initialProject, user);

  // Implement project actions using our service
  const handleAddTimelineEvent = async (event: Omit<TimelineEvent, 'id'>) => {
    try {
      const newEvent = await projectManagementService.addTimelineEvent(projectId, event);
      setTimeline(prev => [...prev, newEvent]);
      toast.success('Նոր իրադարձությունն ավելացվել է ժամանակացույցում');
    } catch (error) {
      console.error('Error adding timeline event:', error);
      toast.error('Չհաջողվեց ավելացնել իրադարձությունը');
    }
  };

  const handleCompleteTimelineEvent = async (eventId: string) => {
    try {
      await projectManagementService.completeTimelineEvent(projectId, eventId);
      setTimeline(prev => 
        prev.map(event => event.id === eventId ? { ...event, isCompleted: true } : event)
      );
      toast.success('Իրադարձությունը նշվել է որպես ավարտված');
    } catch (error) {
      console.error('Error completing timeline event:', error);
      toast.error('Չհաջողվեց թարմացնել իրադարձության կարգավիճակը');
    }
  };

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = await projectManagementService.addTask(projectId, task);
      setTasks(prev => [...prev, newTask]);
      toast.success('Նոր առաջադրանքն ավելացվել է');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Չհաջողվեց ավելացնել առաջադրանքը');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      await projectManagementService.updateTaskStatus(projectId, taskId, status);
      setTasks(prev => 
        prev.map(task => task.id === taskId ? { ...task, status } : task)
      );
      toast.success('Առաջադրանքի կարգավիճակը թարմացվել է');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Չհաջողվեց թարմացնել առաջադրանքի կարգավիճակը');
    }
  };

  const handleSubmitProject = async (feedback: string) => {
    try {
      await projectManagementService.changeProjectStatus(projectId, 'pending', feedback);
      setProjectStatus('pending');
      toast.success('Նախագիծը ուղարկվել է հաստատման');
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error('Չհաջողվեց ուղարկել նախագիծը հաստատման');
    }
  };

  const handleApproveProject = async (feedback: string) => {
    try {
      await projectManagementService.changeProjectStatus(projectId, 'approved', feedback);
      setProjectStatus('approved');
      toast.success('Նախագիծը հաստատվել է');
    } catch (error) {
      console.error('Error approving project:', error);
      toast.error('Չհաջողվեց հաստատել նախագիծը');
    }
  };

  const handleRejectProject = async (feedback: string) => {
    try {
      await projectManagementService.changeProjectStatus(projectId, 'rejected', feedback);
      setProjectStatus('rejected');
      toast.success('Նախագիծը մերժվել է');
    } catch (error) {
      console.error('Error rejecting project:', error);
      toast.error('Չհաջողվեց մերժել նախագիծը');
    }
  };

  const {
    openSupervisorDialog,
    closeSupervisorDialog,
    reserveProject,
    approveReservation,
    rejectReservation,
    getReservationStatus
  } = useProjectActions(
    project,
    user,
    timeline,
    setTimeline,
    tasks,
    setTasks,
    setProjectStatus,
    setIsReserved,
    setProjectReservationsState,
    setShowSupervisorDialog,
    selectedSupervisor
  );

  const projectProgress = calculateProjectProgress(tasks, timeline);

  const selectSupervisor = (supervisorId: string) => {
    setSelectedSupervisor(supervisorId);
  };

  const updateProject = async (updates: Partial<any>): Promise<boolean> => {
    try {
      if (!project || !projectId) {
        toast.error('Նախագիծը չի գտնվել');
        return false;
      }

      setIsUpdating(true);

      // Update project with new data
      const updatedProject = await projectManagementService.updateProject(projectId, updates);
      
      // Update local state
      setProject(updatedProject);
      toast.success('Նախագիծը հաջողությամբ թարմացվել է');
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Նախագծի թարմացման ժամանակ սխալ է տեղի ունեցել');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      projectId, 
      project, 
      isEditing, 
      setIsEditing,
      canEdit,
      timeline,
      tasks,
      projectStatus,
      addTimelineEvent: handleAddTimelineEvent,
      completeTimelineEvent: handleCompleteTimelineEvent,
      addTask: handleAddTask,
      updateTaskStatus: handleUpdateTaskStatus,
      submitProject: handleSubmitProject,
      approveProject: handleApproveProject,
      rejectProject: handleRejectProject,
      reserveProject,
      isReserved,
      projectMembers,
      projectReservations: projectReservationsState,
      approveReservation,
      rejectReservation,
      projectProgress,
      openSupervisorDialog,
      closeSupervisorDialog,
      showSupervisorDialog,
      selectedSupervisor,
      selectSupervisor,
      getReservationStatus,
      updateProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
