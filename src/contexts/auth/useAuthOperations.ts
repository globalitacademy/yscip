
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with email:', email);
      // Track login attempts
      setLoginAttempts(prev => prev + 1);
      
      // Special handling for main admin account
      if (email.toLowerCase() === 'gitedu@bk.ru' && password === 'Qolej2025*') {
        console.log('Login attempt for main admin, using direct access');
        // Direct login for main admin
        setUser(mainAdminUser);
        setIsAuthenticated(true);
        
        // Make sure admin data is stored with additional persistence indicator
        const adminData = {
          ...mainAdminUser,
          isPersistentAdmin: true  // Add a flag to identify this as a persistent admin session
        };
        localStorage.setItem('currentUser', JSON.stringify(adminData));
        
        // Try to activate admin account in background, but don't wait for it
        try {
          supabase.functions.invoke('ensure-admin-activation').catch(err => 
            console.error('Admin activation background error:', err)
          );
        } catch (error) {
          console.error('Error invoking admin activation function:', error);
        }
        
        return true;
      }
      
      // First try Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase login error:', error);
        return handleFallbackLogin(email, password, pendingUsers, mockUsers, setUser, setIsAuthenticated);
      }
      
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userError) {
          console.error('Error fetching user data:', userError);
          return handleFallbackLogin(email, password, pendingUsers, mockUsers, setUser, setIsAuthenticated);
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
          organization: userData.organization
        };
        
        setUser(loggedInUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        console.log('Login successful for:', loggedInUser.email, loggedInUser.role);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return handleFallbackLogin(email, password, pendingUsers, mockUsers, setUser, setIsAuthenticated);
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
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
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
