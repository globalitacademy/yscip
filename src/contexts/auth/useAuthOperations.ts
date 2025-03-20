import { useState } from 'react';
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { PendingUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleFallbackLogin, handleSignUpUser } from '@/utils/authUtils';
import { mainAdminUser, superAdminUser } from './mockAdminUsers';

export const useAuthOperations = (
  user: User | null,
  pendingUsers: PendingUser[],
  setUser: (user: User | null) => void,
  setIsAuthenticated: (value: boolean) => void,
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>
) => {
  const [loginAttempts, setLoginAttempts] = useState(0);

  const login = async (email: string, password: string, useDirectAdminLogin = false): Promise<boolean> => {
    try {
      console.log('Attempting login with email:', email, 'Direct admin login:', useDirectAdminLogin);
      // Track login attempts
      setLoginAttempts(prev => prev + 1);
      
      // Special handling for main admin account with direct login
      if (email.toLowerCase() === 'gitedu@bk.ru' && (password === 'Qolej2025*' || useDirectAdminLogin)) {
        console.log('Using direct admin access');
        
        // Direct login for main admin (always works regardless of backend status)
        setUser(mainAdminUser);
        setIsAuthenticated(true);
        
        // Make sure admin data is stored with additional persistence indicator
        const adminData = {
          ...mainAdminUser,
          isPersistentAdmin: true  // Add a flag to identify this as a persistent admin session
        };
        localStorage.setItem('currentUser', JSON.stringify(adminData));
        
        console.log('Direct admin login successful');
        return true;
      }
      
      // Standard Supabase auth flow
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase login error:', error);
        const fallbackResult = handleFallbackLogin(email, password, pendingUsers, mockUsers, setUser, setIsAuthenticated);
        
        if (fallbackResult) {
          toast.success('Մուտքը հաջողված է։');
        } else if (email.toLowerCase() !== 'gitedu@bk.ru') {
          // Only show error if not admin (admin has special handling)
          toast.error('Սխալ էլ․ հասցե կամ գաղտնաբառ։');
        }
        
        return fallbackResult;
      }
      
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userError) {
          console.error('Error fetching user data:', userError);
          const fallbackResult = handleFallbackLogin(email, password, pendingUsers, mockUsers, setUser, setIsAuthenticated);
          
          if (fallbackResult) {
            toast.success('Մուտքը հաջողված է։');
          }
          
          return fallbackResult;
        }
        
        if (!userData.registration_approved) {
          toast.error('Ձեր հաշիվը սպասում է ադմինիստրատորի հաստատման։');
          await supabase.auth.signOut();
          return false;
        }
        
        const loggedInUser: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as UserRole,
          avatar: userData.avatar,
          department: userData.department,
          registrationApproved: userData.registration_approved,
          organization: userData.organization,
          group: userData.group_name // Note: mapping from group_name to group
        };
        
        setUser(loggedInUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        console.log('Login successful for:', loggedInUser.email, loggedInUser.role);
        return true;
      }
      
      if (email.toLowerCase() !== 'gitedu@bk.ru') {
        toast.error('Սխալ էլ․ հասցե կամ գաղտնաբառ։');
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      const fallbackResult = handleFallbackLogin(email, password, pendingUsers, mockUsers, setUser, setIsAuthenticated);
      
      if (!fallbackResult && email.toLowerCase() !== 'gitedu@bk.ru') {
        toast.error('Սխալ էլ․ հասցե կամ գաղտնաբառ։');
      }
      
      return fallbackResult;
    }
  };

  const registerUser = async (userData: Partial<User> & { password: string }): Promise<{success: boolean, token?: string}> => {
    try {
      console.log('Registering new user:', userData.email, userData.role);
      
      const emailExists = mockUsers.some(user => user.email.toLowerCase() === userData.email?.toLowerCase());
      if (emailExists) {
        toast.error('Այս էլ․ հասցեն արդեն գրանցված է։');
        return { success: false };
      }
      
      const pendingEmailExists = pendingUsers.some(user => user.email?.toLowerCase() === userData.email?.toLowerCase());
      if (pendingEmailExists) {
        toast.error('Այս էլ․ հասցեով գրանցումն արդեն սպասման մեջ է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը։');
        return { success: false };
      }

      // Try Supabase registration first
      const { data, error } = await supabase.auth.signUp({
        email: userData.email || '',
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            organization: userData.organization
          },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) {
        console.error('Supabase registration error:', error);
        toast.error('Գրանցման ընթացքում սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։');
        return handleSignUpUser(userData, pendingUsers, setPendingUsers);
      }

      console.log('Registration successful via Supabase:', data);
      
      // Success message based on role
      toast.success(
        `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
          userData.role !== 'student' ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
        }`
      );

      return { success: true, token: data?.user?.confirmation_sent_at ? 'sent' : undefined };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Գրանցման ընթացքում սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։');
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await supabase.auth.signOut();
      toast.info('Դուք դուրս եք եկել համակարգից։');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Սխալ դուրս գալու ընթացքում։');
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return {
    login,
    logout,
    registerUser,
  };
};
