
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
      console.error('Error fetching projects:', error);
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
      learningOutcomes: project.learning_outcomes || []
    }));
  } catch (error) {
    console.error('Error in fetchProjects:', error);
    return [];
  }
};

// Create a new project in Supabase
export const createProject = async (project: ProjectTheme): Promise<boolean> => {
  try {
    // Ensure all required fields are present
    const projectToCreate = {
      title: project.title,
      description: project.description,
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
      is_public: project.is_public || false
    };

    const { error } = await supabase
      .from('projects')
      .insert(projectToCreate);

    if (error) {
      console.error('Error creating project:', error);
      toast.error('Նախագծի ստեղծման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }

    toast.success('Նախագիծը հաջողությամբ ստեղծվել է');
    return true;
  } catch (error) {
    console.error('Error in createProject:', error);
    toast.error('Նախագծի ստեղծման ժամանակ սխալ է տեղի ունեցել');
    return false;
  }
};

// Update an existing project
export const updateProject = async (id: number, updatedData: Partial<ProjectTheme>): Promise<boolean> => {
  try {
    // Map from ProjectTheme to Supabase column names
    const dataToUpdate: any = {};
    
    if (updatedData.title) dataToUpdate.title = updatedData.title;
    if (updatedData.description) dataToUpdate.description = updatedData.description;
    if (updatedData.image) dataToUpdate.image = updatedData.image;
    if (updatedData.category) dataToUpdate.category = updatedData.category;
    if (updatedData.techStack) dataToUpdate.tech_stack = updatedData.techStack;
    if (updatedData.duration) dataToUpdate.duration = updatedData.duration;
    if (updatedData.complexity) dataToUpdate.complexity = updatedData.complexity;
    if (updatedData.steps) dataToUpdate.steps = updatedData.steps;
    if (updatedData.prerequisites) dataToUpdate.prerequisites = updatedData.prerequisites;
    if (updatedData.learningOutcomes) dataToUpdate.learning_outcomes = updatedData.learningOutcomes;
    if (updatedData.is_public !== undefined) dataToUpdate.is_public = updatedData.is_public;
    
    // Always update the 'updated_at' timestamp
    dataToUpdate.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('projects')
      .update(dataToUpdate)
      .eq('id', id);

    if (error) {
      console.error('Error updating project:', error);
      toast.error('Նախագծի թարմացման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }

    toast.success('Նախագիծը հաջողությամբ թարմացվել է');
    return true;
  } catch (error) {
    console.error('Error in updateProject:', error);
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
      console.error('Error deleting project:', error);
      toast.error('Նախագծի ջնջման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }

    toast.success('Նախագիծը հաջողությամբ ջնջվել է');
    return true;
  } catch (error) {
    console.error('Error in deleteProject:', error);
    toast.error('Նախագծի ջնջման ժամանակ սխալ է տեղի ունեցել');
    return false;
  }
};
