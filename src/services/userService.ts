
import { supabase } from '@/integrations/supabase/client';
import { DBUser, UserRole } from '@/types/database.types';

export const getUsersByRole = async (role: UserRole): Promise<DBUser[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', role);
  
  if (error) {
    console.error('Error fetching users by role:', error);
    return [];
  }
  
  return data as DBUser[];
};

export const getStudentsByCourseAndGroup = async (course?: string, group?: string): Promise<DBUser[]> => {
  let query = supabase
    .from('users')
    .select('*')
    .eq('role', 'student');
  
  if (course && course !== 'all') {
    query = query.eq('course', course);
  }
  
  if (group && group !== 'all') {
    query = query.eq('group_name', group);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }
  
  return data as DBUser[];
};

export const getCourses = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('course')
    .eq('role', 'student')
    .not('course', 'is', null);
  
  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
  
  const courses = data.map(item => item.course as string);
  return [...new Set(courses)].sort();
};

export const getGroups = async (course?: string): Promise<string[]> => {
  let query = supabase
    .from('users')
    .select('group_name')
    .eq('role', 'student')
    .not('group_name', 'is', null);
  
  if (course && course !== 'all') {
    query = query.eq('course', course);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
  
  const groups = data.map(item => item.group_name as string);
  return [...new Set(groups)].sort();
};

export const approveUserRegistration = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('users')
    .update({ registration_approved: true })
    .eq('id', userId);
  
  if (error) {
    console.error('Error approving user registration:', error);
    return false;
  }
  
  return true;
};

export const updateUserProfile = async (userId: string, data: Partial<DBUser>): Promise<boolean> => {
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
  
  return true;
};
