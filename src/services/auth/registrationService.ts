
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { AuthResponse } from './types';

/**
 * Sign up with email and password
 */
export async function register(userData: Partial<User> & { password: string }): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email!,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: userData.role
        }
      }
    });

    if (error) {
      return {
        success: false,
        message: error.message
      };
    }

    return {
      success: true,
      message: 'Հաջողությամբ գրանցվել եք։ Խնդրում ենք հաստատել Ձեր էլ․ փոստը։'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Գրանցման ժամանակ սխալ է տեղի ունեցել'
    };
  }
}
