
import React, { createContext, useContext, useState } from 'react';
import { useProjectState } from '@/hooks/useProjectState';
import { useProjectActions } from '@/hooks/useProjectActions';
import { useAuth } from '@/contexts/AuthContext';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { ProjectReservation } from '@/types/project';
import { calculateProjectProgress } from '@/utils/projectUtils';

// Define the type for project context
interface ProjectContextType {
  projectId: number;
  project: any;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  canEdit: boolean;
  // Add the missing properties
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
}

// Create the context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider props interface
interface ProjectProviderProps {
  children: React.ReactNode;
  projectId: number;
  initialProject: any;
  canEdit?: boolean;
}

// Create a provider component
export const ProjectProvider: React.FC<ProjectProviderProps> = ({ 
  children, 
  projectId, 
  initialProject,
  canEdit = false 
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);

  // Initialize project state
  const {
    project,
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

  // Project actions
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

  // Calculate project progress
  const projectProgress = calculateProjectProgress(tasks);

  // Handler for supervisor selection
  const selectSupervisor = (supervisorId: string) => {
    setSelectedSupervisor(supervisorId);
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
      getReservationStatus
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Hook for using the project context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
