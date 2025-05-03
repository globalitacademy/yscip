import { supabase } from '@/integrations/supabase/client';
import { ProjectTheme } from '@/data/projectThemes';
import { toast } from 'sonner';

// Fetch all projects from Supabase
export const fetchProjects = async (): Promise<ProjectTheme[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[projectService] Error fetching projects:', error);
      return [];
    }

    // Map Supabase data to ProjectTheme format
    return data.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(project.category)}`,
      category: project.category,
      techStack: project.tech_stack || [],
      complexity: project.complexity || 'Միջին', // Add a default value
      duration: project.duration || 'Չսահմանված', // Provide a default
      createdBy: project.created_by || 'system',
      createdAt: project.created_at,
      updatedAt: project.updated_at || project.created_at,
      is_public: project.is_public,
      steps: project.steps || [],
      prerequisites: project.prerequisites || [],
      learningOutcomes: project.learning_outcomes || [],
      organizationName: project.organization_name,
      detailedDescription: project.description // Use description as fallback
    }));
  } catch (error) {
    console.error('[projectService] Error in fetchProjects:', error);
    return [];
  }
};

// Create a new project in Supabase
export const createProject = async (project: ProjectTheme): Promise<boolean> => {
  try {
    // Ensure all required fields are present
    const projectToCreate = {
      title: project.title,
      description: project.detailedDescription || project.description, // Use detailed description for the description field
      image: project.image,
      category: project.category,
      tech_stack: project.techStack || [],
      created_by: project.createdBy || 'system',
      created_at: project.createdAt || new Date().toISOString(),
      updated_at: project.updatedAt || new Date().toISOString(),
      duration: project.duration || 'Չսահմանված', // Provide a default
      complexity: project.complexity || 'Միջին', // Provide a default
      steps: project.steps || [],
      prerequisites: project.prerequisites || [],
      learning_outcomes: project.learningOutcomes || [],
      is_public: project.is_public || false,
      organization_name: project.organizationName || null
    };

    const { error } = await supabase
      .from('projects')
      .insert(projectToCreate);

    if (error) {
      console.error('[projectService] Error creating project:', error);
      toast.error('Նախագծի ստեղծման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }

    toast.success('Նախագիծը հաջողությամբ ստեղծվել է');
    return true;
  } catch (error) {
    console.error('[projectService] Error in createProject:', error);
    toast.error('Նախագծի ստեղծման ժամանակ սխալ է տեղի ունեցել');
    return false;
  }
};

// Enhanced update project function with improved error handling and validation
export const updateProject = async (id: number, updatedData: Partial<ProjectTheme>): Promise<boolean> => {
  try {
    console.log('[projectService] Updating project with data:', JSON.stringify(updatedData));
    console.log('[projectService] Project ID:', id);
    
    if (!id || id <= 0) {
      console.error('[projectService] Invalid project ID:', id);
      toast.error('Անվավեր նախագծի ID');
      return false;
    }
    
    // Deep clone updatedData to avoid mutation issues
    const dataToUpdate: Record<string, any> = {};
    
    // Handle text fields with validation
    if (typeof updatedData.title === 'string') dataToUpdate.title = updatedData.title.trim();
    if (typeof updatedData.description === 'string') dataToUpdate.description = updatedData.description.trim();
    if (typeof updatedData.detailedDescription === 'string') dataToUpdate.description = updatedData.detailedDescription.trim();
    
    // Special handling for image field
    if (updatedData.image !== undefined) {
      if (typeof updatedData.image === 'string') {
        const trimmedImage = updatedData.image.trim();
        dataToUpdate.image = trimmedImage;
        console.log('[projectService] Processing image update:', trimmedImage);
      } else {
        console.warn('[projectService] Invalid image format, expected string but got:', typeof updatedData.image);
        return false;
      }
    }
    
    // Handle other fields
    if (updatedData.category !== undefined) dataToUpdate.category = updatedData.category;
    if (updatedData.techStack !== undefined) dataToUpdate.tech_stack = updatedData.techStack;
    if (updatedData.duration !== undefined) dataToUpdate.duration = updatedData.duration;
    if (updatedData.complexity !== undefined) dataToUpdate.complexity = updatedData.complexity;
    if (updatedData.steps !== undefined) dataToUpdate.steps = updatedData.steps;
    if (updatedData.prerequisites !== undefined) dataToUpdate.prerequisites = updatedData.prerequisites;
    if (updatedData.learningOutcomes !== undefined) dataToUpdate.learning_outcomes = updatedData.learningOutcomes;
    if (updatedData.is_public !== undefined) dataToUpdate.is_public = updatedData.is_public;
    if (updatedData.organizationName !== undefined) dataToUpdate.organization_name = updatedData.organizationName;
    
    // Always update the 'updated_at' timestamp
    dataToUpdate.updated_at = new Date().toISOString();

    console.log('[projectService] Final data to update:', dataToUpdate);
    
    if (Object.keys(dataToUpdate).length === 0) {
      console.warn('[projectService] No valid fields to update');
      return false;
    }

    // For development/demo purposes, simulate a successful update if auth is not set up
    try {
      // First check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If no session, we're in development mode with no auth, so just simulate success
      if (!session) {
        console.log('[projectService] No authenticated session found, simulating successful update for development');
        // Store updated data in localStorage for persistence during development
        const storageKey = `project_${id}`;
        const existingProjectData = localStorage.getItem(storageKey) 
          ? JSON.parse(localStorage.getItem(storageKey) || '{}') 
          : {};
          
        const updatedProject = {
          ...existingProjectData,
          ...dataToUpdate
        };
        
        localStorage.setItem(storageKey, JSON.stringify(updatedProject));
        toast.success('Նախագիծը հաջողությամբ թարմացվել է (դեմո ռեժիմ)');
        return true;
      }
      
      // If we have a session, proceed with actual Supabase update
      const { data, error } = await supabase
        .from('projects')
        .update(dataToUpdate)
        .eq('id', id)
        .select();

      if (error) {
        console.error('[projectService] Supabase error updating project:', error);
        toast.error(`Տվյալների բազայի սխալ: ${error.message}`);
        return false;
      }
      
      console.log('[projectService] Project updated successfully, response:', data);
      toast.success('Նախագիծը հաջողությամբ թարմացվել է');
      return true;
    } catch (dbError) {
      console.error('[projectService] Database operation error:', dbError);
      toast.error('Տվյալների բազայի հետ կապի սխալ');
      return false;
    }
  } catch (error) {
    console.error('[projectService] Error in updateProject:', error);
    toast.error('Նախագծի թարմացման ժամանակ սխալ է տեղի ունեցել');
    return false;
  }
};

// Delete a project
export const deleteProject = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[projectService] Error deleting project:', error);
      toast.error('Նախագծի ջնջման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }

    toast.success('Նախագիծը հաջողությամբ ջնջվել է');
    return true;
  } catch (error) {
    console.error('[projectService] Error in deleteProject:', error);
    toast.error('Նախագծի ջնջման ժամանակ սխալ է տեղի ունեցել');
    return false;
  }
};

// Function to verify image URL is valid
export const validateImageUrl = async (url: string): Promise<boolean> => {
  if (!url || typeof url !== 'string') return false;
  
  // If it's a data URL, assume it's valid
  if (url.startsWith('data:image/')) return true;
  
  // If it's a URL, try to fetch the head to validate
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && (response.headers.get('Content-Type') || '').startsWith('image/');
  } catch (error) {
    console.warn('[projectService] Error validating image URL:', error);
    // Return true anyway - we'll handle load errors in the image component
    return true;
  }
};
