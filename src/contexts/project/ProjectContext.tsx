import React, { createContext, useContext, useState } from 'react';
import { ProjectContextType, ProjectProviderProps } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectState } from '@/hooks/useProjectState';
import { useProjectActions } from '@/hooks/useProjectActions';
import { calculateProjectProgress } from '@/utils/projectProgressUtils';
import { useProjectContextState } from '@/hooks/project/useProjectContextState';

// Create the context with undefined initial value
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ 
  children, 
  projectId, 
  initialProject,
  canEdit = false 
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Use custom hooks to manage state
  const {
    project,
    setProject,
    selectedSupervisor,
    setSelectedSupervisor,
    updateProjectWithState,
    organization,
    setOrganization,
    projectMembers,
    setProjectMembers
  } = useProjectContextState(projectId, initialProject, user);

  const {
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
  } = useProjectState(projectId, project, user);

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
    getReservationStatus,
    updateOrganization
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
    selectedSupervisor,
    setOrganization
  );

  const projectProgress = calculateProjectProgress(tasks, timeline);

  const selectSupervisor = (supervisorId: string) => {
    setSelectedSupervisor(supervisorId);
  };
  
  // Add method to update project members
  const updateProjectMembers = (members: any[]) => {
    console.log('Updating project members:', members);
    setProjectMembers(members);
    // Persist changes if needed
    return updateProjectWithState({ projectMembers: members });
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
      updateProject: updateProjectWithState,
      organization,
      updateOrganization,
      projectMembers,
      updateProjectMembers
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the project context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
