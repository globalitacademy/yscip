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
   * Special admin login bypassing standard auth flow
   */
  async loginAdmin(email: string, password: string): Promise<AuthResponse> {
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
