
import { useEffect } from 'react';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';

/**
 * This hook connects ProjectManagementContext with the AdminProjectGrid
 */
export const useProjectAdminIntegration = () => {
  const projectManagement = useProjectManagement();
  
  // Load projects when the component mounts
  useEffect(() => {
    projectManagement.loadProjects();
  }, [projectManagement]);
  
  // Return the project management context
  return projectManagement;
};
