
import { supabase } from '@/integrations/supabase/client';
import { ProjectTheme } from '@/data/projectThemes';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for handling project-related database operations
 */
export const projectService = {
  /**
   * Fetch all projects from the database
   */
  async fetchProjects(): Promise<ProjectTheme[]> {
    try {
      // First try to get projects from localStorage as a quick load
      const storedProjects = localStorage.getItem('local_projects');
      let localProjects: ProjectTheme[] = [];
      
      if (storedProjects) {
        try {
          localProjects = JSON.parse(storedProjects);
          console.log("Loaded projects from localStorage:", localProjects.length);
        } catch (parseError) {
          console.error("Error parsing localStorage projects:", parseError);
        }
      }
      
      // Fetch from database
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects from Supabase:', error);
        toast.warning('Տվյալների բազայի հետ կապի խնդիր է առաջացել, օգտագործվում են լոկալ տվյալները');
        return localProjects;
      }

      if (!data || data.length === 0) {
        return localProjects;
      }

      // Map database results to ProjectTheme objects
      const dbProjects = data.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(project.category)}`,
        category: project.category,
        techStack: project.tech_stack || [],
        createdBy: project.created_by,
        createdAt: project.created_at,
        updatedAt: project.updated_at || project.created_at,
        duration: project.duration,
        complexity: 'Միջին',
        is_public: project.is_public || false,
        detailedDescription: '',
        steps: [],
        prerequisites: [],
        learningOutcomes: []
      }));
      
      // Merge local and database projects, prioritizing database ones
      const mergedProjects = [...dbProjects];
      
      // Add local projects that don't exist in the database
      for (const localProject of localProjects) {
        if (!dbProjects.some(dbProject => dbProject.id === localProject.id)) {
          mergedProjects.push(localProject);
        }
      }
      
      // Update localStorage with the merged projects
      localStorage.setItem('local_projects', JSON.stringify(mergedProjects));
      
      return mergedProjects;
    } catch (err) {
      console.error('Unexpected error in fetchProjects:', err);
      
      // Try to get projects from localStorage as fallback
      const storedProjects = localStorage.getItem('local_projects');
      if (storedProjects) {
        try {
          return JSON.parse(storedProjects);
        } catch (parseError) {
          console.error("Error parsing localStorage projects:", parseError);
        }
      }
      
      toast.error('Տվյալների ստացման սխալ');
      return [];
    }
  },

  /**
   * Create a new project in the database
   */
  async createProject(project: Partial<ProjectTheme>, userId: string | undefined): Promise<boolean> {
    try {
      // Generate temp ID in case we need to save locally
      const tempId = typeof project.id === 'number' ? project.id : Date.now();
      
      const { error } = await supabase
        .from('projects')
        .insert({
          title: project.title,
          description: project.description,
          category: project.category,
          tech_stack: project.techStack || [], // Ensure we have a default value
          image: project.image,
          created_by: userId,
          duration: project.duration,
          is_public: project.is_public || false
        });
        
      if (error) {
        console.error('Error creating project in Supabase:', error);
        toast.warning('Տվյալների բազայի հետ կապի խնդիր է առաջացել, նախագիծը պահվել է լոկալ');
        
        // Ensure we have an image even if it wasn't provided
        const defaultImage = project.image || 
          (project.category 
            ? `https://source.unsplash.com/random/800x600/?${encodeURIComponent(project.category)}`
            : 'https://source.unsplash.com/random/800x600/?project');
        
        // Save to localStorage for offline support
        const localProject: ProjectTheme = {
          id: tempId,
          title: project.title || '',
          description: project.description || '',
          category: project.category || '',
          techStack: project.techStack || [], // Ensure we have a default array
          image: defaultImage,
          createdBy: userId || 'local-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          duration: project.duration || '',
          complexity: project.complexity || 'Միջին',
          is_public: project.is_public || false,
          detailedDescription: project.detailedDescription || '',
          steps: project.steps || [],
          prerequisites: project.prerequisites || [],
          learningOutcomes: project.learningOutcomes || []
        };
        
        this.saveProjectLocally(localProject);
        
        return true; // Return true since we saved locally
      }
      
      toast.success('Նախագիծը հաջողությամբ ստեղծվել է');
      return true;
    } catch (err) {
      console.error('Unexpected error creating project:', err);
      
      // Ensure we have an image even if it wasn't provided
      const defaultImage = project.image || 
        (project.category 
          ? `https://source.unsplash.com/random/800x600/?${encodeURIComponent(project.category)}` 
          : 'https://source.unsplash.com/random/800x600/?project');
      
      // Save to localStorage as fallback
      const tempId = typeof project.id === 'number' ? project.id : Date.now();
      const localProject: ProjectTheme = {
        id: tempId,
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        techStack: project.techStack || [], // Ensure we have a default array
        image: defaultImage,
        createdBy: userId || 'local-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        duration: project.duration || '',
        complexity: project.complexity || 'Միջին',
        is_public: project.is_public || false,
        detailedDescription: project.detailedDescription || '',
        steps: project.steps || [],
        prerequisites: project.prerequisites || [],
        learningOutcomes: project.learningOutcomes || []
      };
      
      this.saveProjectLocally(localProject);
      
      toast.warning('Տվյալների բազայի հետ կապի սխալ, նախագիծը պահվել է լոկալ');
      return true; // Return true since we saved locally
    }
  },

  /**
   * Save a project locally in localStorage
   */
  saveProjectLocally(project: ProjectTheme): void {
    try {
      const storedProjects = localStorage.getItem('local_projects');
      let projects: ProjectTheme[] = storedProjects ? JSON.parse(storedProjects) : [];
      
      // Get current timestamp for updating
      const currentTimestamp = new Date().toISOString();
      
      // Ensure the project has all required fields
      const completeProject: ProjectTheme = {
        id: project.id,
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        techStack: project.techStack || [], // Ensure we have a default array
        image: project.image || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(project.category || 'project')}`,
        createdBy: project.createdBy || 'local-user',
        createdAt: project.createdAt || currentTimestamp,
        updatedAt: currentTimestamp, // Always set the current timestamp for updatedAt
        duration: project.duration || '',
        complexity: project.complexity || 'Միջին',
        is_public: project.is_public || false,
        detailedDescription: project.detailedDescription || '',
        steps: project.steps || [],
        prerequisites: project.prerequisites || [],
        learningOutcomes: project.learningOutcomes || []
      };
      
      const index = projects.findIndex((p: ProjectTheme) => p.id === project.id);
      if (index >= 0) {
        projects[index] = completeProject;
      } else {
        projects.push(completeProject);
      }
      
      localStorage.setItem('local_projects', JSON.stringify(projects));
      console.log('Project saved locally:', completeProject.title);
    } catch (error) {
      console.error('Error saving project to localStorage:', error);
    }
  },

  /**
   * Update a project in the database
   */
  async updateProject(projectId: number, updates: Partial<ProjectTheme>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          is_public: updates.is_public,
          duration: updates.duration,
          tech_stack: updates.techStack,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
        
      if (error) {
        console.error('Error updating project in Supabase:', error);
        
        // Update locally
        const localProject = {
          ...updates,
          id: projectId,
          updatedAt: new Date().toISOString()
        };
        
        this.saveProjectLocally(localProject);
        
        toast.warning('Տվյալների բազայի հետ կապի խնդիր է առաջացել, նախագիծը պահվել է լոկալ');
        return true; // Return true since we saved locally
      }
      
      toast.success('Նախագիծը հաջողությամբ թարմացվել է');
      return true;
    } catch (err) {
      console.error('Unexpected error updating project:', err);
      
      // Update locally
      const localProject = {
        ...updates,
        id: projectId,
        updatedAt: new Date().toISOString()
      };
      
      this.saveProjectLocally(localProject);
      
      toast.warning('Տվյալների բազայի հետ կապի սխալ, նախագիծը պահվել է լոկալ');
      return true; // Return true since we saved locally
    }
  },

  /**
   * Update a project's image in the database
   */
  async updateProjectImage(projectId: number, imageUrl: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          image: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
        
      if (error) {
        console.error('Error updating project image in Supabase:', error);
        
        // Update image locally
        const storedProjects = localStorage.getItem('local_projects');
        if (storedProjects) {
          let projects = JSON.parse(storedProjects);
          const index = projects.findIndex((p: ProjectTheme) => p.id === projectId);
          if (index >= 0) {
            projects[index].image = imageUrl;
            // Set the updated timestamp
            projects[index].updatedAt = new Date().toISOString();
            localStorage.setItem('local_projects', JSON.stringify(projects));
          }
        }
        
        toast.warning('Տվյալների բազայի հետ կապի խնդիր է առաջացել, նկարը պահվել է լոկալ');
        return true; // Return true since we saved locally
      }
      
      toast.success('Նախագծի նկարը հաջողությամբ թարմացվել է');
      return true;
    } catch (err) {
      console.error('Unexpected error updating project image:', err);
      
      // Update image locally
      const storedProjects = localStorage.getItem('local_projects');
      if (storedProjects) {
        let projects = JSON.parse(storedProjects);
        const index = projects.findIndex((p: ProjectTheme) => p.id === projectId);
        if (index >= 0) {
          projects[index].image = imageUrl;
          // Set the updated timestamp
          projects[index].updatedAt = new Date().toISOString();
          localStorage.setItem('local_projects', JSON.stringify(projects));
        }
      }
      
      toast.warning('Տվյալների բազայի հետ կապի սխալ, նկարը պահվել է լոկալ');
      return true; // Return true since we saved locally
    }
  },

  /**
   * Delete a project from the database
   */
  async deleteProject(projectId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
        
      if (error) {
        console.error('Error deleting project from Supabase:', error);
        toast.error('Նախագծի ջնջման ժամանակ սխալ է տեղի ունեցել, փորձեք ավելի ուշ');
        return false;
      }
      
      // Remove from localStorage if it exists there
      const storedProjects = localStorage.getItem('local_projects');
      if (storedProjects) {
        let projects = JSON.parse(storedProjects);
        projects = projects.filter((p: ProjectTheme) => p.id !== projectId);
        localStorage.setItem('local_projects', JSON.stringify(projects));
      }
      
      toast.success('Նախագիծը հաջողությամբ ջնջվել է');
      return true;
    } catch (err) {
      console.error('Unexpected error deleting project:', err);
      toast.error('Նախագծի ջնջման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
  }
};
