
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';

export async function getUserBySession(session: any): Promise<DBUser | null> {
  try {
    console.log('Getting user data for session:', session.user.id);
    
    if (!session.user) {
      console.log('No user in session');
      return null;
    }
    
    // First try to get user from database
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      // Handle RLS errors - this may be due to RLS policies blocking access
      console.error('Error fetching user from database:', error);
      return await createOrReturnUserFromAuth(session.user);
    }
    
    if (userData) {
      console.log('User found in database', userData.id);
      return userData as DBUser;
    } else {
      console.log('User not found in database, creating from auth');
      return await createOrReturnUserFromAuth(session.user);
    }
  } catch (err) {
    console.error('Unexpected error in getUserBySession:', err);
    return await createOrReturnUserFromAuth(session.user);
  }
}

export async function createOrReturnUserFromAuth(authUser: any): Promise<DBUser | null> {
  if (!authUser) {
    console.log('No auth user provided');
    return null;
  }
  
  try {
    console.log('Trying to get role from auth metadata');
    
    // Safely get email with fallback
    const email = authUser.email || '';
    
    // Get role from metadata and default to student if not set
    const role = authUser.user_metadata?.role || 'student';
    
    // For students, auto-approve. For other roles, approval is needed.
    const isAutoApproved = role === 'student';
    
    console.log(`User role from metadata: ${role}, auto-approved: ${isAutoApproved}`);
    
    // Try to create user record in database if it doesn't exist
    try {
      console.log('Attempting to create user record in database');
      
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking for existing user:', checkError);
        throw checkError;
      }
      
      if (!existingUser) {
        console.log('User does not exist in database, creating...');
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: email,
            name: authUser.user_metadata?.name || (email ? email.split('@')[0] : 'User'),
            role: role,
            registration_approved: isAutoApproved
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error inserting user:', insertError);
          throw insertError;
        }
        
        console.log('User created successfully:', newUser?.id);
        return newUser as DBUser;
      } else {
        console.log('User already exists in database');
      }
    } catch (insertError) {
      console.error('Error creating user record:', insertError);
      
      // If we failed to create a user record, use the auth data directly
      return {
        id: authUser.id,
        email: email,
        name: authUser.user_metadata?.name || (email ? email.split('@')[0] : 'User'),
        role: role as any,
        registration_approved: isAutoApproved,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    // If we haven't returned yet, try to get user data again
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (userError) {
      console.error('Error getting user after creation/check:', userError);
      
      if (authUser) {
        // Return user data from auth system since we can't access the database
        console.log('Using auth data directly due to RLS issues');
        
        return {
          id: authUser.id,
          email: email,
          name: authUser.user_metadata?.name || (email ? email.split('@')[0] : 'User'),
          role: (authUser.user_metadata?.role as any) || 'student',
          registration_approved: authUser.user_metadata?.registration_approved !== false,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at
        };
      } else {
        return null;
      }
    }
    
    console.log('User fetched after creation/check:', userData?.id);
    return userData as DBUser;
    
  } catch (error) {
    console.error('Unhandled error in createOrReturnUserFromAuth:', error);
    
    if (authUser) {
      // Safely get email with fallback
      const email = authUser.email || '';
      
      // Return basic user info from auth as fallback
      return {
        id: authUser.id,
        email: email,
        name: authUser.user_metadata?.name || (email ? email.split('@')[0] : 'User'),
        role: (authUser.user_metadata?.role as any) || 'student',
        registration_approved: authUser.user_metadata?.registration_approved !== false,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at
      };
    }
    
    return null;
  }
}

// Fallback function to get user data directly from Auth
export async function getUserFromAuth(): Promise<DBUser | null> {
  console.log('Getting user data directly from Auth');
  
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const email = authUser.email || '';
      
      return {
        id: authUser.id,
        email: email,
        name: authUser.user_metadata?.name || (email ? email.split('@')[0] : 'User'),
        role: (authUser.user_metadata?.role as any) || 'student',
        registration_approved: authUser.user_metadata?.registration_approved !== false,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user from Auth:', error);
    return null;
  }
}

export async function checkUserApprovalStatus(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('registration_approved, role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking approval status:', error);
      
      // Fallback to auth user data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Students are auto-approved, otherwise check metadata
        const role = user.user_metadata?.role || 'student';
        return role === 'student' || user.user_metadata?.registration_approved === true;
      }
      return false;
    }
    
    // Students are always considered approved
    if (data.role === 'student') {
      return true;
    }
    
    return data.registration_approved === true;
  } catch (error) {
    console.error('Unexpected error checking approval:', error);
    return false;
  }
}
