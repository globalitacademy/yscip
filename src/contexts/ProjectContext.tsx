
import React, { createContext, useContext } from 'react';
import { calculateProjectProgress } from '@/utils/projectUtils';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectContextType, ProjectProviderProps } from '@/types/project';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { useProjectState } from '@/hooks/useProjectState';
import { useProjectActions } from '@/hooks/useProjectActions';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ 
  projectId, 
  initialProject,
  children 
}) => {
  const { user } = useAuth();
  
  // Use custom hooks to manage state and actions
  const {
    project,
    timeline,
    tasks,
    projectStatus,
    isReserved,
    projectReservationsState,
    selectedSupervisor,
    setSelectedSupervisor,
    showSupervisorDialog,
    setShowSupervisorDialog,
    setTimeline,
    setTasks,
    setProjectStatus,
    setIsReserved,
    setProjectReservationsState
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
  
  // Get permissions based on user role
  const permissions = useProjectPermissions(user?.role);
  
  // Calculate project progress
  const projectProgress = calculateProjectProgress(tasks, timeline);
  
  // Role-based permissions
  const canStudentSubmit = permissions.canSubmitProject && isReserved;
  const canInstructorCreate = permissions.canCreateProjects;
  const canInstructorAssign = permissions.canAssignProjects;
  const canSupervisorApprove = permissions.canApproveProject;

  const selectSupervisor = (supervisorId: string) => {
    setSelectedSupervisor(supervisorId);
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
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
        canStudentSubmit,
        canInstructorCreate,
        canInstructorAssign,
        canSupervisorApprove,
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
      }}
    >
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
