
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
    
    // Use a direct query that avoids RLS recursion
    const { data: userData, error } = await supabase.rpc(
      'get_user_by_id',
      { user_id: session.user.id }
    );
    
    if (error) {
      console.error('Error fetching user data by session:', error);
      // Fallback to a basic user object if we can't get the full profile
      return {
        id: session.user.id,
        email: session.user.email,
        name: 'User',
        role: 'student',
        created_at: new Date().toISOString()
      };
    }
    
    if (!userData) {
      console.log('No user data found for session user ID:', session.user.id);
      return {
        id: session.user.id,
        email: session.user.email,
        name: 'User',
        role: 'student',
        created_at: new Date().toISOString()
      };
    }
    
    console.log('User data retrieved successfully');
    return userData as DBUser;
  } catch (err) {
    console.error('Unexpected error in getUserBySession:', err);
    // Return a minimal user object based on auth data in case of errors
    if (session && session.user) {
      return {
        id: session.user.id,
        email: session.user.email,
        name: 'User',
        role: 'student',
        created_at: new Date().toISOString()
      };
    }
    return null;
  }
}

// Check user approval status
export async function checkUserApprovalStatus(userId: string): Promise<boolean> {
  try {
    console.log('Checking approval status for user ID:', userId);
    
    const { data, error } = await supabase.rpc(
      'check_user_approval',
      { user_id: userId }
    );
    
    if (error) {
      console.error('Error checking user approval status:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Unexpected error in checkUserApprovalStatus:', err);
    return false;
  }
}

// Export other helper functions
export { checkExistingEmail, checkFirstAdmin } from './sessionHelpers';
