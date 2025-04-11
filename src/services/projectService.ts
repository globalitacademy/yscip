
import { ProjectTheme } from '@/data/projectThemes';
import { projectThemes } from '@/data/projectThemes';
import { toast } from 'sonner';

/**
 * Fetch all projects (mock implementation)
 * @returns A promise that resolves to an array of projects
 */
export const fetchProjects = async (): Promise<ProjectTheme[]> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return projectThemes;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

/**
 * Update a project in the database (currently mock implementation)
 * @param projectId The ID of the project to update
 * @param updates The updated project data
 * @returns A boolean indicating success or failure
 */
export const updateProject = async (
  projectId: number, 
  updates: Partial<ProjectTheme>
): Promise<boolean> => {
  try {
    console.log(`Updating project ${projectId} with:`, updates);
    
    // This is a mock implementation - in a real app, this would be an API call
    // For now, we'll update our in-memory array and simulate success
    const projectIndex = projectThemes.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      console.error(`Project with ID ${projectId} not found`);
      return false;
    }
    
    // Update the project in memory
    projectThemes[projectIndex] = {
      ...projectThemes[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
};

/**
 * Delete a project from the database (currently mock implementation)
 * @param projectId The ID of the project to delete
 * @returns A boolean indicating success or failure
 */
export const deleteProject = async (projectId: number): Promise<boolean> => {
  try {
    console.log(`Deleting project ${projectId}`);
    
    // This is a mock implementation - in a real app, this would be an API call
    const projectIndex = projectThemes.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      console.error(`Project with ID ${projectId} not found`);
      return false;
    }
    
    // Remove the project from memory
    projectThemes.splice(projectIndex, 1);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

/**
 * Create a new project in the database (currently mock implementation)
 * @param projectData The project data to create
 * @returns The created project or null if there was an error
 */
export const createProject = async (
  projectData: Omit<ProjectTheme, 'id'>
): Promise<ProjectTheme | null> => {
  try {
    console.log('Creating new project:', projectData);
    
    // Generate a new ID for the project
    const newId = Math.max(...projectThemes.map(p => p.id)) + 1;
    
    // Create the new project
    const newProject: ProjectTheme = {
      ...projectData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the project to memory
    projectThemes.push(newProject);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
};
