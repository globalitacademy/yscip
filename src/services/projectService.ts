
import { supabase } from '@/integrations/supabase/client';
import { DBProject, DBProjectAssignment } from '@/types/database.types';

export const getProjects = async (): Promise<DBProject[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*');
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  return data as DBProject[];
};

export const getProjectById = async (id: number): Promise<DBProject | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
  
  return data as DBProject;
};

export const createProject = async (project: Omit<DBProject, 'id' | 'created_at' | 'updated_at'>): Promise<DBProject | null> => {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  
  return data as DBProject;
};

export const updateProject = async (id: number, project: Partial<DBProject>): Promise<boolean> => {
  const { error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating project with ID ${id}:`, error);
    return false;
  }
  
  return true;
};

export const deleteProject = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    return false;
  }
  
  return true;
};

// Project assignments
export const assignProjectToStudent = async (assignment: Omit<DBProjectAssignment, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  const { error } = await supabase
    .from('project_assignments')
    .insert(assignment);
  
  if (error) {
    console.error('Error assigning project:', error);
    return false;
  }
  
  return true;
};

export const getProjectAssignmentsForUser = async (userId: string): Promise<DBProjectAssignment[]> => {
  const { data, error } = await supabase
    .from('project_assignments')
    .select('*')
    .eq('student_id', userId);
  
  if (error) {
    console.error(`Error fetching assignments for user ${userId}:`, error);
    return [];
  }
  
  return data as DBProjectAssignment[];
};

export const getStudentsForProject = async (projectId: number): Promise<string[]> => {
  const { data, error } = await supabase
    .from('project_assignments')
    .select('student_id')
    .eq('project_id', projectId);
  
  if (error) {
    console.error(`Error fetching students for project ${projectId}:`, error);
    return [];
  }
  
  return data.map(item => item.student_id);
};

export const updateProjectAssignment = async (id: number, data: Partial<DBProjectAssignment>): Promise<boolean> => {
  const { error } = await supabase
    .from('project_assignments')
    .update(data)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating assignment with ID ${id}:`, error);
    return false;
  }
  
  return true;
};
