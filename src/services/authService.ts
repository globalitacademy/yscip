
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export const authService = {
  /**
   * Sign in with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
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

      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar,
        department: userData.department,
        course: userData.course,
        group: userData.group_name,
        registrationApproved: userData.registration_approved,
        organization: userData.organization
      };

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
  },

  /**
   * Sign up with email and password
   */
  async register(userData: Partial<User> & { password: string }): Promise<AuthResponse> {
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
  },

  /**
   * Sign out the current user
   */
  async logout(): Promise<AuthResponse> {
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
  },

  /**
   * Get the current user session
   */
  async getCurrentUser(): Promise<User | null> {
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

      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar,
        department: userData.department,
        course: userData.course,
        group: userData.group_name,
        registrationApproved: userData.registration_approved,
        organization: userData.organization
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
};
