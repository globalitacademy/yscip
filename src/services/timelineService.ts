
import { supabase } from '@/integrations/supabase/client';
import { DBTimelineEvent } from '@/types/database.types';

export const getTimelineEventsForProject = async (projectId: number): Promise<DBTimelineEvent[]> => {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('project_id', projectId)
    .order('date', { ascending: true });
  
  if (error) {
    console.error(`Error fetching timeline events for project ${projectId}:`, error);
    return [];
  }
  
  return data as DBTimelineEvent[];
};

export const createTimelineEvent = async (event: Omit<DBTimelineEvent, 'id' | 'created_at' | 'updated_at'>): Promise<DBTimelineEvent | null> => {
  const { data, error } = await supabase
    .from('timeline_events')
    .insert(event)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating timeline event:', error);
    return null;
  }
  
  return data as DBTimelineEvent;
};

export const completeTimelineEvent = async (id: number, completed: boolean): Promise<boolean> => {
  const { error } = await supabase
    .from('timeline_events')
    .update({ 
      completed, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating timeline event ${id}:`, error);
    return false;
  }
  
  return true;
};

export const updateTimelineEvent = async (id: number, event: Partial<DBTimelineEvent>): Promise<boolean> => {
  const { error } = await supabase
    .from('timeline_events')
    .update({ 
      ...event, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating timeline event ${id}:`, error);
    return false;
  }
  
  return true;
};

export const deleteTimelineEvent = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('timeline_events')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting timeline event ${id}:`, error);
    return false;
  }
  
  return true;
};
