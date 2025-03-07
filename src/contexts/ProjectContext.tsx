
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ProjectContextType, 
  ProjectProviderProps, 
  ProjectReservation 
} from '@/types/project';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { 
  calculateProjectProgress,
  loadProjectReservations,
  isProjectReservedByUser,
  saveProjectReservation,
  updateReservationStatus,
  generateSampleTimeline,
  generateSampleTasks
} from '@/utils/projectUtils';

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
  const [projectReservations, setProjectReservations] = useState<ProjectReservation[]>([]);

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
    const reservations = loadProjectReservations();
    setProjectReservations(reservations);
    
    // Check if current project is reserved by current user
    if (projectId && user) {
      const userReserved = isProjectReservedByUser(projectId, user.id, reservations);
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

  // Add sample timeline events for demo
  useEffect(() => {
    if (timeline.length === 0 && project) {
      const demoTimeline = generateSampleTimeline();
      setTimeline(demoTimeline);
    }
  }, [timeline.length, project]);

  // Add sample tasks for demo
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

  const reserveProject = (supervisorId?: string, instructorId?: string) => {
    // Only students can reserve projects
    if (!user || user.role !== 'student' || !project) return;
    
    // Save reservation in localStorage
    saveProjectReservation(project, user.id, supervisorId, instructorId);
    
    // Update local state
    setIsReserved(true);
    setProjectReservations(loadProjectReservations());
  };

  const approveReservation = (projectId: number) => {
    if (!user) return;
    
    const updatedReservations = updateReservationStatus(
      projectId, 
      user.id, 
      user.role, 
      'approved'
    );
    
    setProjectReservations(updatedReservations);
  };

  const rejectReservation = (projectId: number, feedback: string) => {
    if (!user) return;
    
    const updatedReservations = updateReservationStatus(
      projectId, 
      user.id, 
      user.role, 
      'rejected', 
      feedback
    );
    
    setProjectReservations(updatedReservations);
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
        projectReservations,
        approveReservation,
        rejectReservation,
        projectProgress
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
