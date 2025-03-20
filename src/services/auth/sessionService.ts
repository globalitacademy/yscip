
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { AuthResponse } from './types';
import { mapDatabaseUserToUserModel } from '@/hooks/auth/utils';

/**
 * Sign out the current user
 */
export async function logout(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message
      };
    }

    return {
      success: true,
      message: 'Դուք հաջողությամբ դուրս եք եկել համակարգից'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Դուրս գալու ժամանակ սխալ է տեղի ունեցել'
    };
  }
}

/**
 * Get the current user session
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return null;
    }

    // Get user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error('Error getting user profile:', userError);
      return null;
    }

    return mapDatabaseUserToUserModel(userData);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
