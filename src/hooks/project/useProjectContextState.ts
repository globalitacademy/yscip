
import { useState } from 'react';
import { updateProject } from '@/contexts/project/projectUpdateService';
import { User } from '@/types/user';
import { ProjectMember } from '@/contexts/project/types';

/**
 * Hook for managing additional project context state
 */
export const useProjectContextState = (projectId: number, initialProject: any, user: User | null) => {
  const [project, setProject] = useState<any>(initialProject);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
  
  // Organization state
  const [organization, setOrganization] = useState<{
    id: string;
    name: string;
    website: string;
    logo: string;
  } | null>(initialProject?.organization || null);
  
  // Project members state
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>(initialProject?.projectMembers || []);

  // Enhanced updateProject function with state updates
  const updateProjectWithState = async (updates: Partial<any>): Promise<boolean> => {
    try {
      setIsUpdating(true);
      console.log('Updating project with:', updates);
      
      const success = await updateProject(projectId, project, updates);
      
      if (success) {
        // Update local state
        const updatedProject = {
          ...project,
          ...updates,
          updated_at: new Date().toISOString()
        };
        
        setProject(updatedProject);
        
        // Update organization if included in updates
        if (updates.organization) {
          setOrganization(updates.organization);
        }
        
        // Update project members if included in updates
        if (updates.projectMembers) {
          setProjectMembers(updates.projectMembers);
        }
        
        // Handle image updates separately to ensure consistency across different views
        if (updates.image) {
          console.log("Updating project image to:", updates.image);
        }
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
    updateProjectWithState,
    organization,
    setOrganization,
    projectMembers,
    setProjectMembers
  };
};
