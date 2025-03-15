
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminOperations = (
  setPendingUsers: React.Dispatch<React.SetStateAction<any[]>>,
  setUser: (user: User | null) => void
) => {
  const switchRole = (role: UserRole) => {
    const userWithRole = mockUsers.find(u => u.role === role);
    if (userWithRole) {
      setUser(userWithRole);
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
    }
  };

  const getPendingUsers = () => [];

  const resetAdminAccount = async (): Promise<boolean> => {
    try {
      console.log('Resetting admin account');
      
      // Try to use local approach first to ensure admin account is available in mockUsers
      // Add main admin to mock data if not exists
      const adminExists = mockUsers.some(user => user.email === 'gitedu@bk.ru');
      
      if (!adminExists) {
        const newAdmin: User = {
          id: `admin-${Date.now()}`,
          name: 'Ադմինիստրատոր',
          email: 'gitedu@bk.ru',
          role: 'admin',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=giteduadmin`,
          department: 'Ադմինիստրացիա',
          registrationApproved: true
        };
        
        mockUsers.push(newAdmin);
      }
      
      // After local setup, try edge function for Supabase
      try {
        const { data, error } = await supabase.functions.invoke('ensure-admin-activation');
        
        if (error) {
          console.error('Error calling admin activation function:', error);
        } else {
          console.log('Admin activation function response:', data);
        }
      } catch (error) {
        console.error('Error with edge function:', error);
        // Continue even if edge function fails
      }
      
      toast.success('Ադմինիստրատորի հաշիվը վերականգնված է։');
      return true;
    } catch (error) {
      console.error('Error resetting admin account:', error);
      toast.error('Սխալ ադմինիստրատորի հաշիվը վերականգնելիս։');
      return false;
    }
  };

  // Function to register real accounts by admin
  const registerRealAccount = async (userData: Partial<User> & { password: string }): Promise<{success: boolean, user?: User}> => {
    try {
      // Make sure we have required fields
      if (!userData.email || !userData.name || !userData.role || !userData.password) {
        toast.error('Բոլոր պարտադիր դաշտերը պետք է լրացված լինեն');
        return { success: false };
      }

      // Try to create user with Supabase
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role
        }
      });

      if (authError) {
        console.error('Error creating user in auth:', authError);
        toast.error(`Օգտատիրոջ ստեղծման սխալ: ${authError.message}`);
        return { success: false };
      }

      if (authData.user) {
        // If successful, create user profile in users table
        const { data: userData2, error: userError } = await supabase
          .from('users')
          .upsert({
            id: authData.user.id,
            name: userData.name,
            email: userData.email,
            role: userData.role as UserRole,
            department: userData.department,
            course: userData.role === 'student' ? userData.course : null,
            group_name: userData.role === 'student' ? userData.group : null,
            organization: userData.role === 'employer' ? userData.organization : null,
            registration_approved: true,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`
          });

        if (userError) {
          console.error('Error creating user in users table:', userError);
          toast.error(`Օգտատիրոջ պրոֆիլի ստեղծման սխալ: ${userError.message}`);
          return { success: false };
        }

        // Return the created user
        const newUser: User = {
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as UserRole,
          department: userData.department,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`,
          course: userData.role === 'student' ? userData.course : undefined,
          group: userData.role === 'student' ? userData.group : undefined,
          organization: userData.role === 'employer' ? userData.organization : undefined,
          registrationApproved: true
        };

        toast.success(`${newUser.name} օգտատերը հաջողությամբ ստեղծվել է։`);
        return { success: true, user: newUser };
      }
    } catch (error) {
      console.error('Error registering real account:', error);
      toast.error('Սխալ իրական հաշվի գրանցման ժամանակ');
    }

    return { success: false };
  };

  return {
    switchRole,
    getPendingUsers,
    resetAdminAccount,
    registerRealAccount
  };
};
