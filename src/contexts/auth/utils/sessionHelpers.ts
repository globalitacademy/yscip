
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
        role: isDesignatedAdminEmail(session.user.email) ? 'admin' : 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        registration_approved: isDesignatedAdminEmail(session.user.email) ? true : true // Auto-approve designated admin
      };
    }
    
    if (!userData) {
      console.log('No user data found for session user ID:', session.user.id);
      return {
        id: session.user.id,
        email: session.user.email,
        name: 'User',
        role: isDesignatedAdminEmail(session.user.email) ? 'admin' : 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        registration_approved: isDesignatedAdminEmail(session.user.email) ? true : true // Auto-approve designated admin
      };
    }
    
    // Ensure the designated admin is always marked as approved
    if (isDesignatedAdminEmail(session.user.email) && (!userData.registration_approved || userData.role !== 'admin')) {
      await ensureDesignatedAdminApproved(session.user.id, session.user.email);
      userData.registration_approved = true;
      userData.role = 'admin';
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
        role: isDesignatedAdminEmail(session.user.email) ? 'admin' : 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        registration_approved: isDesignatedAdminEmail(session.user.email) ? true : true // Auto-approve designated admin
      };
    }
    return null;
  }
}

// Simple helper function to check if email is the designated admin
function isDesignatedAdminEmail(email: string): boolean {
  return email === 'gitedu@bk.ru';
}

// Ensure the designated admin is approved in the database
async function ensureDesignatedAdminApproved(userId: string, email: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        role: 'admin', 
        registration_approved: true 
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error ensuring designated admin is approved:', error);
    } else {
      console.log('Designated admin status ensured for:', email);
    }
  } catch (err) {
    console.error('Unexpected error ensuring designated admin status:', err);
  }
}

// Check user approval status
export async function checkUserApprovalStatus(userId: string): Promise<boolean> {
  try {
    console.log('Checking approval status for user ID:', userId);
    
    // First check if this is the designated admin
    const { data: userData } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();
    
    if (userData && isDesignatedAdminEmail(userData.email)) {
      // Make sure the admin is approved
      await ensureDesignatedAdminApproved(userId, userData.email);
      return true;
    }
    
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

// Check if email exists
export async function checkExistingEmail(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error checking existing email:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Unexpected error checking email:', err);
    return false;
  }
}

// Check if this is the first admin using the database function
export async function checkFirstAdmin(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('get_first_admin_status');

    if (error) {
      console.error('Error checking if first admin:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Unexpected error checking first admin:', err);
    return false;
  }
}

// Approve first admin
export async function approveFirstAdmin(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc(
      'approve_first_admin',
      { admin_email: email }
    );
    
    if (error) {
      console.error('Error approving first admin:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Unexpected error approving first admin:', err);
    return false;
  }
}

// Check if the email is designated admin
export async function isDesignatedAdmin(email: string): Promise<boolean> {
  // Skip database call and perform direct check for efficiency
  return isDesignatedAdminEmail(email);
}

// Auto-approve designated admin account and process email verification
export async function verifyDesignatedAdmin(email: string): Promise<boolean> {
  if (!isDesignatedAdminEmail(email)) {
    return false;
  }
  
  try {
    // Update all instances of the user to be an admin and approved
    const { error } = await supabase
      .from('users')
      .update({ 
        role: 'admin',
        registration_approved: true
      })
      .eq('email', email);
    
    if (error) {
      console.error('Error verifying designated admin:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error verifying designated admin:', err);
    return false;
  }
}
