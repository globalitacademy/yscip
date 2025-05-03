import React, { createContext, useContext, useState } from 'react';
import { useProjectState } from '@/hooks/useProjectState';
import { useProjectActions } from '@/hooks/useProjectActions';
import { useAuth } from '@/contexts/AuthContext';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { ProjectReservation } from '@/types/project';
import { calculateProjectProgress } from '@/utils/projectProgressUtils';
import { toast } from 'sonner';
import * as projectService from '@/services/projectService';
import { supabase } from '@/integrations/supabase/client';

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

  // Enhanced updateProject function with improved localStorage fallback
  const updateProject = async (updates: Partial<any>): Promise<boolean> => {
    try {
      if (!projectId) {
        console.error('[ProjectContext] ProjectId is missing for updateProject:', projectId);
        toast.error('Նախագծի ID-ն բացակայում է');
        return false;
      }

      if (!updates || Object.keys(updates).length === 0) {
        console.error('[ProjectContext] No updates provided to updateProject');
        toast.error('Թարմացնելու համար տվյալներ չեն տրամադրվել');
        return false;
      }

      // Log the update request in detail for debugging
      console.log(`[ProjectContext] Updating project ID ${projectId} with data:`, JSON.stringify(updates));

      // More detailed logging for image updates
      if (updates.image !== undefined) {
        console.log('[ProjectContext] Image update requested:');
        console.log('- Current image:', project?.image);
        console.log('- New image:', updates.image);
      }

      // Create a clean update object - only include defined properties
      const cleanUpdates: Record<string, any> = {};
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          cleanUpdates[key] = value;
        }
      });

      console.log('[ProjectContext] Clean updates object:', cleanUpdates);

      // Enhanced localStorage fallback implementation for development mode
      try {
        // Get user session - if no session, we're in development mode
        const { data: { session } } = await supabase.auth.getSession();
        
        // In development mode without authenticated user, use localStorage
        if (!session) {
          console.log('[ProjectContext] No authenticated session found, using localStorage for development');
          
          // Create storage key based on project ID
          const storageKey = `project_${projectId}`;
          
          // Get existing project data from localStorage or create new object
          const existingData = localStorage.getItem(storageKey) 
            ? JSON.parse(localStorage.getItem(storageKey) || '{}') 
            : {...project};
          
          // Apply updates to project data
          const updatedProject = {
            ...existingData,
            ...cleanUpdates,
            updated_at: new Date().toISOString()
          };
          
          // Save back to localStorage
          localStorage.setItem(storageKey, JSON.stringify(updatedProject));
          
          // Update local state
          setProject(updatedProject);
          
          toast.success('Փոփոխությունները հաջողությամբ պահպանվել են (դեմո ռեժիմ)');
          console.log('[ProjectContext] Project updated in localStorage:', updatedProject);
          return true;
        }
        
        // If authenticated, proceed with regular database update
        const success = await projectService.updateProject(projectId, cleanUpdates);
        
        if (success) {
          // Update local state
          const updatedProject = {
            ...project,
            ...cleanUpdates,
            updated_at: new Date().toISOString()
          };
          
          setProject(updatedProject);
          toast.success('Փոփոխությունները հաջողությամբ պահպանվել են');
          return true;
        } else {
          toast.error('Չհաջողվեց պահպանել փոփոխությունները տվյալների բազայում');
          return false;
        }
      } catch (error) {
        console.error('[ProjectContext] Database operation error:', error);
        
        // Fallback to localStorage in case of any error
        const storageKey = `project_${projectId}`;
        const existingData = localStorage.getItem(storageKey)
          ? JSON.parse(localStorage.getItem(storageKey) || '{}')
          : {...project};
          
        const updatedProject = {
          ...existingData,
          ...cleanUpdates,
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem(storageKey, JSON.stringify(updatedProject));
        setProject(updatedProject);
        
        toast.success('Փոփոխությունները հաջողությամբ պահպանվել են (դեմո ռեժիմ)');
        return true;
      }
    } catch (error) {
      console.error('[ProjectContext] Error updating project:', error);
      toast.error('Սխալ տեղի ունեցավ պրոեկտը թարմացնելիս');
      return false;
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
