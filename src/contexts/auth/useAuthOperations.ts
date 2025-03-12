
import { useState } from 'react';
import { User, UserRole, mockUsers } from '@/data/userRoles';
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
  
  const login = async (email: string, password: string): Promise<boolean> => {
    // Handle main admin login specifically
    if (email === 'gitedu@bk.ru' && password === 'Qolej2025*') {
      setUser(mainAdminUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(mainAdminUser));
      
      // Try to ensure admin account is activated in Supabase
      try {
        await supabase.functions.invoke('ensure-admin-activation', {
          body: { email, password }
        });
      } catch (error) {
        console.error('Failed to run admin activation function:', error);
        // Continue with login even if this fails since we have the fallback
      }
      
      return true;
    }
    
    if (email === 'superadmin@example.com' && password === 'SuperAdmin123') {
      setUser(superAdminUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(superAdminUser));
      return true;
    }
    
    try {
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
          return false;
        }
        
        if (!userData.registration_approved) {
          toast.error(`Ձեր հաշիվը սպասում է ադմինիստրատորի հաստատման։`);
          await supabase.auth.signOut();
          return false;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return handleFallbackLogin(email, password, pendingUsers, mockUsers, setUser, setIsAuthenticated);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const registerUser = async (userData: Partial<User> & { password: string }): Promise<{success: boolean, token?: string}> => {
    try {
      const emailExists = mockUsers.some(user => user.email.toLowerCase() === userData.email?.toLowerCase());
      if (emailExists) {
        toast.error(`Այս էլ․ հասցեն արդեն գրանցված է։`);
        return { success: false };
      }
      
      const pendingEmailExists = pendingUsers.some(user => user.email?.toLowerCase() === userData.email?.toLowerCase());
      if (pendingEmailExists) {
        toast.error(`Այս էլ․ հասցեով գրանցումն արդեն սպասման մեջ է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը։`);
        return { success: false };
      }
      
      try {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email || '',
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              role: userData.role,
              organization: userData.organization
            }
          }
        });
        
        if (error) {
          console.error('Supabase registration error:', error);
          return handleSignUpUser(userData, pendingUsers, setPendingUsers);
        }
        
        toast.success(
          `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
            userData.role !== 'student' ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
          }`
        );
        
        return { success: true };
      } catch (supaError) {
        console.error('Supabase registration error:', supaError);
        return handleSignUpUser(userData, pendingUsers, setPendingUsers);
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false };
    }
  };

  return {
    login,
    logout,
    registerUser,
  };
};
