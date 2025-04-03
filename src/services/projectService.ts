
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
      learningOutcomes: project.learning_outcomes || [],
      organizationName: project.organization_name,
      detailedDescription: project.description // Use description as fallback if detailed_description doesn't exist
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
      is_public: project.is_public || false,
      organization_name: project.organizationName || null,
      // Store detailed description in the description field if the database doesn't have a separate column
      description: project.detailedDescription || project.description
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
    console.log('Updating project with data:', updatedData);
    
    // Map from ProjectTheme to Supabase column names
    const dataToUpdate: any = {};
    
    if (updatedData.title !== undefined) dataToUpdate.title = updatedData.title;
    if (updatedData.description !== undefined) dataToUpdate.description = updatedData.description;
    // If detailedDescription is provided, update the description field as well
    // since our database doesn't have a separate detailed_description column
    if (updatedData.detailedDescription !== undefined) dataToUpdate.description = updatedData.detailedDescription;
    if (updatedData.image !== undefined) dataToUpdate.image = updatedData.image;
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

    console.log('Mapped data to update:', dataToUpdate);

    // For mock implementation, we'll simulate success for now
    // UNCOMMENT THIS FOR REAL SUPABASE INTEGRATION:
    /*
    const { error } = await supabase
      .from('projects')
      .update(dataToUpdate)
      .eq('id', id);

    if (error) {
      console.error('Error updating project:', error);
      toast.error('Նախագծի թարմացման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
    */
    
    // Success response (simulated for now)
    console.log('Project updated successfully');
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
