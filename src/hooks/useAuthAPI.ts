import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/data/userRoles';
import { SupabaseAdminUser } from '@/types/auth';
import { toast } from 'sonner';

export const useAuthAPI = () => {
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
        console.error('Login error:', error);
        toast.error('Մուտքը չի հաջողվել: ' + error.message);
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

  // Helper function to create superadmin account if it doesn't exist
  const createSuperAdminAccount = async (): Promise<boolean> => {
    try {
      const SUPER_ADMIN_EMAIL = 'superadmin@npua.am';
      const SUPER_ADMIN_PASSWORD = 'SuperAdmin123!';

      // Create the superadmin account
      const { data, error } = await supabase.auth.signUp({
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
        options: {
          data: {
            name: 'Սուպերադմինիստրատոր',
            role: 'superadmin',
            registration_approved: true,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin${Date.now()}`
          }
        }
      });

      if (error) {
        console.error('Error creating superadmin account:', error);
        return false;
      }

      console.log('Superadmin account created successfully');
      return true;
    } catch (error) {
      console.error('Error in createSuperAdminAccount:', error);
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

  // Գրանցման հաստատման ֆունկցիա ադմինիստրատորի համար
  const approveRegistration = async (userId: string, currentUser: User | null): Promise<boolean> => {
    try {
      // Ստուգել արդյոք ընթացիկ օգտատերը ադմին է կամ սուպերադմին
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
        toast.error('Միայն ադմինիստ��ատորը կարող է հաստատել գրանցումները։');
        return false;
      }

      // Ստանալ օգտատիրոջ տվյալները
      const { data, error } = await supabase.auth.admin.getUserById(userId);

      if (error) {
        console.error('Get user error:', error);
        return false;
      }

      if (!data.user) {
        toast.error('Օգտատերը չի գտնվել։');
        return false;
      }

      // Թարմացնել օգտատիրոջ մետա տվյալները
      const userMetadata = {
        ...data.user.user_metadata,
        registration_approved: true
      };

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: userMetadata }
      );

      if (updateError) {
        console.error('Update user error:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Approve registration error:', error);
      return false;
    }
  };

  // Ստանալ հաստատման սպասող օգտատերերին
  const getPendingUsers = async (currentUser: User | null): Promise<any[]> => {
    try {
      // Ստուգել արդյոք ընթացիկ օգտատերը ադմին է կամ սուպերադմին
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
        return [];
      }

      // Ստանալ բոլոր օգտատերերին
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('List users error:', error);
        return [];
      }
      
      // Explicit typing of users array to fix type errors
      const users = (data?.users || []) as SupabaseAdminUser[];
      
      // Ֆիլտրել հաստատման սպասող օգտատերերին
      const pendingUsers = users.filter(u => 
        u.email_confirmed_at && // Էլ. հասցեն հաստատված է
        u.user_metadata?.role && // Ունի դեր
        ['lecturer', 'employer', 'project_manager', 'supervisor'].includes(u.user_metadata.role) && // Դերը պահանջում է հաստատում
        !u.user_metadata?.registration_approved // Դեռ չի հաստատվել
      );
      
      return pendingUsers;
    } catch (error) {
      console.error('Get pending users error:', error);
      return [];
    }
  };

  // Helper function to convert Supabase user to our User type
  const mapSupabaseUserToUser = (supabaseUser: any): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || 'User',
      role: (supabaseUser.user_metadata?.role as UserRole) || 'student',
      registrationApproved: supabaseUser.user_metadata?.registration_approved || false,
      avatar: supabaseUser.user_metadata?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
      ...(supabaseUser.user_metadata?.organization ? { organization: supabaseUser.user_metadata.organization } : {}),
      ...(supabaseUser.user_metadata?.department ? { department: supabaseUser.user_metadata.department } : {})
    };
  };

  return {
    login,
    logout,
    registerUser,
    verifyEmail,
    approveRegistration,
    getPendingUsers,
    mapSupabaseUserToUser
  };
};
