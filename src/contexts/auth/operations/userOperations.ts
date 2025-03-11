
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';

export const registerUser = async (
  userData: Partial<DBUser> & { password: string }
): Promise<boolean> => {
  try {
    console.log('Registering user with data:', { ...userData, password: '******' });
    
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email || '',
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          organization: userData.organization
        }
      }
    });

    if (authError) {
      console.error('Error registering user with Supabase Auth:', authError);
      return false;
    }

    console.log('User registered successfully with Auth:', authData.user?.id);
    
    // Create user profile in the database
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          organization: userData.organization,
          registration_approved: userData.registration_approved || false,
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // We don't return false here, as the auth user was created successfully
      }
    }

    return true;
  } catch (error) {
    console.error('Unexpected error during registration:', error);
    return false;
  }
};
