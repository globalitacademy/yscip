
import React, { createContext, useContext, useState } from 'react';
import { useProjectState } from '@/hooks/useProjectState';
import { useProjectActions } from '@/hooks/useProjectActions';
import { useAuth } from '@/contexts/AuthContext';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { ProjectReservation } from '@/types/project';
import { calculateProjectProgress } from '@/utils/projectProgressUtils';
import { toast } from 'sonner';
import * as projectService from '@/services/projectService';

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

  const {
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
        console.error('No project found or projectId is missing');
        toast.error('Նախագիծը չի գտնվել');
        return false;
      }

      setIsUpdating(true);
      console.log(`Updating project ID ${projectId} with data:`, updates);

      // Combine current project data with updates
      const updatedProject = {
        ...project,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Call the projectService to update the project in the database
      const success = await projectService.updateProject(projectId, updatedProject);
      
      if (success) {
        // Update local state after successful API call
        setProject(updatedProject);
        console.log('Project updated successfully:', updatedProject);
        return true;
      } else {
        console.error('Failed to update project');
        return false;
      }
    } catch (error) {
      console.error('Error updating project:', error);
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
      addTimelineEvent,
      completeTimelineEvent,
      addTask,
      updateTaskStatus,
      submitProject,
      approveProject,
      rejectProject,
      reserveProject,
      isReserved,
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
