
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { 
  generateSampleTimeline, 
  generateSampleTasks, 
  loadProjectReservations,
  isProjectReservedByUser
} from '@/utils/projectUtils';
import { User } from '@/types/user';
import { toast } from 'sonner';
import * as projectService from '@/services/projectService';

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
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

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

  // Function to start editing mode
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Function to cancel editing mode
  const cancelEditing = useCallback(() => {
    if (initialProject) {
      setProject(initialProject);
      setTimeline(initialProject.timeline || []);
      setTasks(initialProject.tasks || []);
    }
    setIsEditing(false);
    setUnsavedChanges(false);
  }, [initialProject]);

  // Function to update a specific project field
  const updateProjectField = useCallback((field: keyof ProjectTheme, value: any) => {
    setProject(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
    setUnsavedChanges(true);
  }, []);

  // Function to save project changes
  const saveProject = useCallback(async () => {
    if (!project || !projectId) return false;
    
    setIsSaving(true);
    try {
      const success = await projectService.updateProject(projectId, project);
      if (success) {
        toast.success("Նախագծի փոփոխությունները հաջողությամբ պահպանվել են");
        setIsEditing(false);
        setUnsavedChanges(false);
        return true;
      } else {
        toast.error("Նախագծի պահպանման ժամանակ սխալ է տեղի ունեցել");
        return false;
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Նախագծի պահպանման ժամանակ սխալ է տեղի ունեցել");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [project, projectId]);

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
    setShowSupervisorDialog,
    isEditing,
    setIsEditing,
    startEditing,
    cancelEditing,
    updateProjectField,
    saveProject,
    isSaving,
    unsavedChanges
  };
};
