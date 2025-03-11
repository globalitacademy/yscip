
import { supabase } from '@/integrations/supabase/client';
import { DBTask } from '@/types/database.types';

export const getTasksForProject = async (projectId: number): Promise<DBTask[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching tasks for project ${projectId}:`, error);
    return [];
  }
  
  return data as DBTask[];
};

export const getTasksAssignedToUser = async (userId: string): Promise<DBTask[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching tasks assigned to user ${userId}:`, error);
    return [];
  }
  
  return data as DBTask[];
};

export const createTask = async (task: Omit<DBTask, 'id' | 'created_at' | 'updated_at'>): Promise<DBTask | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating task:', error);
    return null;
  }
  
  return data as DBTask;
};

export const updateTaskStatus = async (id: number, status: DBTask['status']): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating task status for task ${id}:`, error);
    return false;
  }
  
  return true;
};

export const updateTask = async (id: number, task: Partial<DBTask>): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .update({ ...task, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating task ${id}:`, error);
    return false;
  }
  
  return true;
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting task ${id}:`, error);
    return false;
  }
  
  return true;
};
