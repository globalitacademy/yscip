
import { ProjectTheme } from '@/data/projectThemes';

/**
 * Get all projects
 */
export const getProjects = async (): Promise<ProjectTheme[]> => {
  try {
    // Mocking API call for now
    const response = await fetch('/api/projects');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    
    // Fallback to local data import if API call fails
    const { projectThemes } = await import('@/data/projectThemes');
    return projectThemes;
  }
};

/**
 * Create a new project
 */
export const createProject = async (project: ProjectTheme): Promise<ProjectTheme> => {
  try {
    // Mocking API call for now
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Fallback to local implementation
    const { createProject } = await import('@/data/projectThemes');
    return createProject(project);
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (projectId: number, updates: Partial<ProjectTheme>): Promise<ProjectTheme> => {
  try {
    // Mocking API call for now
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    
    // Fallback to local implementation
    const { updateProject } = await import('@/data/projectThemes');
    return updateProject(projectId, updates);
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId: number): Promise<boolean> => {
  try {
    // Mocking API call for now
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting project:', error);
    
    // Fallback to local implementation
    const { deleteProject } = await import('@/data/projectThemes');
    return deleteProject(projectId);
  }
};
