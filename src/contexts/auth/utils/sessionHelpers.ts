
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';

// Get user data by session
export async function getUserBySession(session: any): Promise<DBUser | null> {
  try {
    if (!session || !session.user || !session.user.id) {
      console.log('No valid session provided to getUserBySession');
      return null;
    }

    console.log('Getting user data by session for user ID:', session.user.id);
    
    // Query the user from the database using the auth.id
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user data by session:', error);
      return null;
    }
    
    if (!userData) {
      console.log('No user data found for session user ID:', session.user.id);
      return null;
    }
    
    console.log('User data retrieved successfully');
    return userData as DBUser;
  } catch (err) {
    console.error('Unexpected error in getUserBySession:', err);
    return null;
  }
}

// Check user approval status
export async function checkUserApprovalStatus(userId: string): Promise<boolean> {
  try {
    console.log('Checking approval status for user ID:', userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('role, registration_approved')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking user approval status:', error);
      return false;
    }
    
    // Students are automatically approved, others need approval
    return data.role === 'student' || data.registration_approved === true;
  } catch (err) {
    console.error('Unexpected error in checkUserApprovalStatus:', err);
    return false;
  }
}

// Check if email already exists
export async function checkExistingEmail(email: string): Promise<boolean> {
  try {
    console.log('Checking if email already exists:', email);
    
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is what we want
      console.error('Error checking existing email:', error);
      return false;
    }
    
    // If data exists, email is already in use
    return !!data;
  } catch (err) {
    console.error('Unexpected error in checkExistingEmail:', err);
    return false;
  }
}

// Check if this is the first admin being created
export async function checkFirstAdmin(): Promise<boolean> {
  try {
    console.log('Checking if this is the first admin registration');
    
    const { count, error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin');
    
    if (error) {
      console.error('Error checking for existing admins:', error);
      return false;
    }
    
    // Return true if no admins exist yet
    return count === 0;
  } catch (err) {
    console.error('Unexpected error in checkFirstAdmin:', err);
    return false;
  }
}
