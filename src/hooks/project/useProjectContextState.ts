
import { useState } from 'react';
import { updateProject } from '@/contexts/project/projectUpdateService';
import { User } from '@/types/user';

/**
 * Hook for managing additional project context state
 */
export const useProjectContextState = (projectId: number, initialProject: any, user: User | null) => {
  const [project, setProject] = useState<any>(initialProject);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);

  // Enhanced updateProject function with state updates
  const updateProjectWithState = async (updates: Partial<any>): Promise<boolean> => {
    try {
      setIsUpdating(true);
      const success = await updateProject(projectId, project, updates);
      
      if (success) {
        // Update local state
        const updatedProject = {
          ...project,
          ...updates,
          updated_at: new Date().toISOString()
        };
        
        setProject(updatedProject);
      }
      
      return success;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    project,
    setProject,
    isUpdating,
    selectedSupervisor,
    setSelectedSupervisor,
    updateProjectWithState
  };
};
