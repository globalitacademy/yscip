
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';

export const getUserBySession = async (session: any): Promise<DBUser | null> => {
  if (!session) return null;

  try {
    console.log('Fetching user data for ID:', session.user.id);
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
    
    if (!userData) {
      console.error('No user data found for ID:', session.user.id);
      return null;
    }
    
    console.log('User data fetched successfully:', userData);
    return userData as DBUser;
  } catch (error) {
    console.error('Unexpected error fetching user data:', error);
    return null;
  }
};

export const checkFirstAdmin = async (): Promise<boolean> => {
  const { data: existingAdmins, error: adminCheckError } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .limit(1);
  
  if (!adminCheckError && (!existingAdmins || existingAdmins.length === 0)) {
    return true;
  }
  return false;
};

export const checkExistingEmail = async (email: string): Promise<boolean> => {
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .single();
  
  if (existingUser) {
    return true;
  }
  
  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 means no rows returned, which is expected
    console.error('Error checking email:', checkError);
    throw new Error('Error checking user data');
  }
  
  return false;
};
