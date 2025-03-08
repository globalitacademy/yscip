
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/data/userRoles';
import { toast } from 'sonner';
import { mapSupabaseUserToUser } from './authUtils';

export const useAuthCore = () => {
  // Մուտք գործելու ֆունկցիա
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Special case for superadmin
      if (email === 'superadmin@npua.am') {
        console.log('Attempting superadmin login');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Show email confirmation warning if that's the issue
        if (error.message.includes('Email not confirmed')) {
          toast.warning('Ձեր էլ․ հասցեն դեռ չի հաստատվել: Խնդրում ենք ստուգել Ձեր էլ․ փոստը հաստատման հղումով:');
        } else {
          console.error('Login error:', error);
          toast.error('Մուտքը չի հաջողվել: ' + error.message);
        }
        return false;
      }

      if (data?.user) {
        // Ստուգել արդյոք օգտատերը հաստատված է (եթե ուսանող չէ և ոչ էլ սուպերադմին)
        const role = data.user.user_metadata?.role || 'student';
        const isApproved = data.user.user_metadata?.registration_approved || false;

        // Superadmin always bypasses approval check
        if (role === 'superadmin') {
          console.log('Superadmin login successful');
          return true;
        }

        if (!isApproved && role !== 'student' && role !== 'superadmin') {
          toast.error('Ձեր հաշիվը սպասում է ադմինիստրատորի հաստատման։');
          await supabase.auth.signOut();
          return false;
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Դուրս գալու ֆունկցիա
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  // Էլ․ հասցեի հաստատման ֆունկցիա
  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      // Supabase-ն ավտոմատ կհաստատի էլ․ հասցեն վերադարձման URL-ի միջոցով
      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      return false;
    }
  };

  return {
    login,
    logout,
    verifyEmail
  };
};
