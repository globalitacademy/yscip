
import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { useProjectState } from '@/hooks/useProjectState';
import { useAuth } from './AuthContext';
import * as projectService from '@/services/projectService';

interface ProjectContextProps {
  project: ProjectTheme | null;
  tasks: Task[];
  timeline: TimelineEvent[];
  projectProgress: number;
  canEdit: boolean;
  isReserved: boolean;
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  updateProject: (updates: Partial<ProjectTheme>) => Promise<boolean>;
  isEditing: boolean;
  startEditing: () => void;
  cancelEditing: () => void;
  saveProject: () => Promise<boolean>;
  updateProjectField: (field: keyof ProjectTheme, value: any) => void;
  isSaving: boolean;
  unsavedChanges: boolean;
}

const ProjectContext = createContext<ProjectContextProps | null>(null);

interface ProjectProviderProps {
  projectId: number | null;
  initialProject: ProjectTheme | null;
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  projectId,
  initialProject,
  children,
}) => {
  const { user } = useAuth();
  
  const {
    project,
    setProject,
    tasks,
    timeline,
    isReserved,
    projectStatus,
    isEditing,
    startEditing,
    cancelEditing,
    updateProjectField,
    saveProject,
    isSaving,
    unsavedChanges
  } = useProjectState(projectId, initialProject, user);

  // Calculate project progress (e.g. based on completed tasks)
  const projectProgress = Math.round(
    tasks.filter((task) => task.completed).length / tasks.length * 100
  ) || 0;

  // Determine if the current user can edit the project
  const canEdit = !!user && (
    user.role === 'admin' || 
    user.role === 'lecturer' || 
    user.role === 'employer' || 
    (project && project.createdBy === user.id)
  );

  // Function to update project
  const updateProject = useCallback(async (updates: Partial<ProjectTheme>) => {
    if (!project || !projectId) return false;
    try {
      const success = await projectService.updateProject(projectId, updates);
      if (success && project) {
        // Update local state
        setProject({
          ...project,
          ...updates,
          updatedAt: new Date().toISOString()
        });
      }
      return success;
    } catch (error) {
      console.error('Error updating project:', error);
      return false;
    }
  }, [project, projectId, setProject]);

  return (
    <ProjectContext.Provider
      value={{
        project,
        tasks,
        timeline,
        projectProgress,
        canEdit,
        isReserved,
        projectStatus,
        updateProject,
        isEditing,
        startEditing,
        cancelEditing,
        saveProject,
        updateProjectField,
        isSaving,
        unsavedChanges
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
