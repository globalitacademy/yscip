
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { AuthResponse } from './types';
import { mapDatabaseUserToUserModel } from '@/hooks/auth/utils';

/**
 * Sign in with email and password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return {
        success: false,
        message: error.message
      };
    }

    // Get user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user?.id)
      .single();

    if (userError) {
      return {
        success: false,
        message: 'Օգտատիրոջ պրոֆիլը չի գտնվել'
      };
    }

    const user = mapDatabaseUserToUserModel(userData);

    return {
      success: true,
      message: 'Մուտքը հաջողված է',
      user
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Մուտքի ժամանակ սխալ է տեղի ունեցել'
    };
  }
}

/**
 * Special admin login bypassing standard auth flow
 */
export async function loginAdmin(email: string, password: string): Promise<AuthResponse> {
  try {
    // First try normal sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // If sign in works, use that
    if (!error && data.user) {
      // Get user profile from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!userError && userData) {
        const user = mapDatabaseUserToUserModel(userData);

        return {
          success: true,
          message: 'Մուտքը հաջողված է',
          user
        };
      }
    }

    // If normal sign in doesn't work, try to get admin user from public.users directly
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('role', 'admin')
      .single();

    if (adminError || !adminData) {
      return {
        success: false,
        message: 'Ադմինիստրատորի հաշիվը չի գտնվել'
      };
    }

    // Create direct admin user
    const user: User = {
      id: adminData.id,
      name: adminData.name || 'Administrator',
      email: adminData.email,
      role: 'admin',
      avatar: adminData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      registrationApproved: true
    };

    return {
      success: true,
      message: 'Ադմինիստրատորի մուտքը հաջողված է',
      user
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Ադմինիստրատորի մուտքի ժամանակ սխալ է տեղի ունեցել'
    };
  }
}
