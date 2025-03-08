
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/data/userRoles';
import { SupabaseAdminUser } from '@/types/auth';
import { toast } from 'sonner';

export const useUserRegistration = () => {
  // Գրանցման ֆունկցիա
  const registerUser = async (userData: Partial<User>): Promise<{success: boolean, message?: string}> => {
    try {
      const { email, password, name, role, organization, department } = userData as {
        email?: string;
        password?: string;
        name?: string;
        role?: UserRole;
        organization?: string;
        department?: string;
      };

      if (!email || !password || !name || !role) {
        return { 
          success: false, 
          message: 'Բոլոր պարտադիր դաշտերը պետք է լրացվեն։' 
        };
      }

      // Ստուգել արդյոք օգտատերը արդեն գրանցված է
      const { data: getUsersData, error: getUsersError } = await supabase.auth.admin.listUsers();
      
      if (getUsersError) {
        console.error('Failed to check existing users:', getUsersError);
        return { 
          success: false, 
          message: 'Սխալ՝ օգտատերերի ստուգման ժամանակ։' 
        };
      }
      
      // Explicit typing of users array to fix type errors
      const users = (getUsersData?.users || []) as SupabaseAdminUser[];
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        return { 
          success: false, 
          message: 'Այս էլ․ հասցեն արդեն գրանցված է։' 
        };
      }

      // Մետա տվյալները ձևավորում
      const userMetadata: any = {
        name,
        role,
        registration_approved: role === 'student', // Ուսանողների համար ավտոմատ հաստատում
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      };

      // Եթե նշված է կազմակերպությունը գործատուի համար
      if (role === 'employer' && organization) {
        userMetadata.organization = organization;
      }

      // Եթե նշված է ֆակուլտետը դասախոսի համար
      if ((role === 'lecturer' || role === 'project_manager') && department) {
        userMetadata.department = department;
      }

      // Գրանցում
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return { 
          success: false, 
          message: error.message 
        };
      }

      if (data?.user) {
        const needsApproval = ['lecturer', 'employer', 'project_manager', 'supervisor'].includes(role);
        
        toast.success(
          `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
            needsApproval ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
          }`
        );
        
        return { success: true };
      }

      return { 
        success: false, 
        message: 'Սխալ գրանցման ընթացքում։ Խնդրում ենք փորձել կրկին։' 
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Գրանցման սխալ' 
      };
    }
  };

  return {
    registerUser
  };
};
