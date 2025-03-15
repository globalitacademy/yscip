import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectContextType, ProjectProviderProps } from '@/types/project';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { 
  calculateProjectProgress,
  generateSampleTimeline,
  generateSampleTasks
} from '@/utils/projectProgressUtils';
import {
  ProjectReservation,
  loadProjectReservations,
  isProjectReservedByUser,
  saveProjectReservation,
  updateReservationStatus
} from '@/utils/reservationUtils';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ 
  projectId, 
  initialProject,
  children 
}) => {
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectTheme | null>(initialProject);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectStatus, setProjectStatus] = useState<'not_submitted' | 'pending' | 'approved' | 'rejected'>('not_submitted');
  const [isReserved, setIsReserved] = useState(false);
  const [projectReservationsState, setProjectReservationsState] = useState<ProjectReservation[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
  const [showSupervisorDialog, setShowSupervisorDialog] = useState(false);

  // Get permissions based on user role
  const permissions = useProjectPermissions(user?.role);
  
  // Calculate project progress
  const projectProgress = calculateProjectProgress(tasks, timeline);
  
  // Role-based permissions
  const canStudentSubmit = permissions.canSubmitProject && isReserved;
  const canInstructorCreate = permissions.canCreateProjects;
  const canInstructorAssign = permissions.canAssignProjects;
  const canSupervisorApprove = permissions.canApproveProject;

  // Load project reservations from localStorage
  useEffect(() => {
    const loadedReservations = loadProjectReservations();
    setProjectReservationsState(loadedReservations);
    
    // Check if current project is reserved by current user
    if (projectId && user) {
      const userReserved = isProjectReservedByUser(projectId, user.id, loadedReservations);
      setIsReserved(userReserved);
    }
  }, [projectId, user]);

  useEffect(() => {
    if (initialProject) {
      setProject(initialProject);
      setTimeline(initialProject.timeline || []);
      setTasks(initialProject.tasks || []);
    }
  }, [initialProject]);

  useEffect(() => {
    if (timeline.length === 0 && project) {
      const demoTimeline = generateSampleTimeline();
      setTimeline(demoTimeline);
    }
  }, [timeline.length, project]);

  useEffect(() => {
    if (tasks.length === 0 && project && user) {
      const demoTasks = generateSampleTasks(user.id);
      setTasks(demoTasks);
    }
  }, [tasks.length, project, user]);

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
    setSelectedSupervisor(supervisorId);
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
    if (!projectId || !user) return null;
    
    const reservation = projectReservationsState.find(
      res => res.projectId === projectId && (res.userId === user.id || res.studentId === user.id)
    );
    
    return reservation ? reservation.status : null;
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
