
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { 
  calculateProjectProgress,
  generateSampleTimeline,
  generateSampleTasks,
  loadProjectReservations,
  isProjectReservedByUser
} from '@/utils/projectUtils';
import { User } from '@/types/user';

export const useProjectState = (
  projectId: number | null,
  initialProject: ProjectTheme | null,
  user: User | null
) => {
  const [project, setProject] = useState<ProjectTheme | null>(initialProject);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectStatus, setProjectStatus] = useState<'not_submitted' | 'pending' | 'approved' | 'rejected'>('not_submitted');
  const [isReserved, setIsReserved] = useState(false);
  const [projectReservationsState, setProjectReservationsState] = useState<any[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
  const [showSupervisorDialog, setShowSupervisorDialog] = useState(false);

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

  // Initialize project from props
  useEffect(() => {
    if (initialProject) {
      setProject(initialProject);
      setTimeline(initialProject.timeline || []);
      setTasks(initialProject.tasks || []);
    }
  }, [initialProject]);

  // Generate sample timeline if empty
  useEffect(() => {
    if (timeline.length === 0 && project) {
      const demoTimeline = generateSampleTimeline();
      setTimeline(demoTimeline);
    }
  }, [timeline.length, project]);

  // Generate sample tasks if empty
  useEffect(() => {
    if (tasks.length === 0 && project && user) {
      const demoTasks = generateSampleTasks(user.id);
      setTasks(demoTasks);
    }
  }, [tasks.length, project, user]);

  return {
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
    selectedSupervisor,
    setSelectedSupervisor,
    showSupervisorDialog,
    setShowSupervisorDialog
  };
};
