
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';

export const getUserBySession = async (session: any): Promise<DBUser | null> => {
  if (!session) {
    console.log('No session provided to getUserBySession');
    return null;
  }

  try {
    console.log('Fetching user data for ID:', session.user.id);
    
    // First try to get user from users table
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      
      // If error is "No rows found", it might mean user exists in auth but not in users table
      if (error.code === 'PGRST116') {
        console.log('No user found in users table, checking auth metadata');
        
        // Get user metadata from auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          console.log('User found in auth, creating user record with metadata:', authUser.user_metadata);
          
          // Determine if user should be auto-approved based on role
          const role = authUser.user_metadata.role || 'student';
          const isAutoApproved = role === 'student';
          
          // Create user record based on auth data
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email,
              name: authUser.user_metadata.name || authUser.email?.split('@')[0] || 'User',
              role: role,
              registration_approved: isAutoApproved
            })
            .select('*')
            .single();
          
          if (insertError) {
            console.error('Error creating user record:', insertError);
            return null;
          }
          
          console.log('New user record created:', newUser);
          return newUser as DBUser;
        }
      }
      
      return null;
    }
    
    if (!userData) {
      console.error('No user data found for ID:', session.user.id);
      return null;
    }
    
    console.log('User data fetched successfully:', userData);
    
    // Check if user is approved before returning
    if (!userData.registration_approved && userData.role !== 'student') {
      console.log('User account is pending approval:', userData.id);
      // Still return the user, but UI will show "pending approval" state
    }
    
    return userData as DBUser;
  } catch (error) {
    console.error('Unexpected error fetching user data:', error);
    return null;
  }
};

export const checkFirstAdmin = async (): Promise<boolean> => {
  try {
    const { data: existingAdmins, error: adminCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1);
    
    if (adminCheckError) {
      console.error('Error checking for existing admins:', adminCheckError);
      return false;
    }
    
    if (!existingAdmins || existingAdmins.length === 0) {
      console.log('No existing admins found, this will be the first admin');
      return true;
    }
    
    console.log('Existing admins found:', existingAdmins.length);
    return false;
  } catch (error) {
    console.error('Unexpected error checking for first admin:', error);
    return false;
  }
};

export const checkExistingEmail = async (email: string): Promise<boolean> => {
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected
      console.error('Error checking email:', checkError);
      throw new Error('Error checking user data');
    }
    
    if (existingUser) {
      console.log('Email already exists:', email);
      return true;
    }
    
    console.log('Email does not exist:', email);
    return false;
  } catch (error) {
    console.error('Unexpected error checking email:', error);
    throw error;
  }
};

// New helper to check user approval status
export const checkUserApprovalStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('is_user_approved', { user_id: userId });
    
    if (error) {
      console.error('Error checking user approval status:', error);
      // Default to false if there's an error
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Unexpected error checking user approval status:', error);
    return false;
  }
};
