
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, mockUsers } from '@/data/userRoles';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, PendingUser } from '@/types/auth';
import { handleFallbackLogin, handleSignUpUser } from '@/utils/authUtils';

// Add superadmin to mockUsers
const superAdminUser: User = {
  id: 'superadmin',
  name: 'Սուպերադմին',
  email: 'superadmin@example.com',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin',
  department: 'Ադմինիստրացիա',
  registrationApproved: true
};

// Check if superadmin already exists
if (!mockUsers.some(user => user.email === superAdminUser.email)) {
  mockUsers.push(superAdminUser);
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  // Load initial session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          
          if (userData) {
            const loggedInUser: User = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role as UserRole,
              avatar: userData.avatar,
              department: userData.department,
              registrationApproved: userData.registration_approved,
            };
            
            setUser(loggedInUser);
            setIsAuthenticated(true);
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) throw error;
            
            if (userData) {
              const loggedInUser: User = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role as UserRole,
                avatar: userData.avatar,
                department: userData.department,
                registrationApproved: userData.registration_approved,
              };
              
              setUser(loggedInUser);
              setIsAuthenticated(true);
              localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('currentUser');
        }
      }
    );
    
    const storedPendingUsers = localStorage.getItem('pendingUsers');
    if (storedPendingUsers) {
      setPendingUsers(JSON.parse(storedPendingUsers));
    }
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save pendingUsers to localStorage when it changes
  useEffect(() => {
    if (pendingUsers.length > 0) {
      localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
    }
  }, [pendingUsers]);

  const login = async (email: string, password: string): Promise<boolean> => {
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

  const registerUser = async (userData: Partial<User>): Promise<{success: boolean, token?: string}> => {
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
      
      const password = userData.password;
      if (!password) {
        toast.error(`Գաղտնաբառը պարտադիր է։`);
        return { success: false };
      }
      
      try {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email || '',
          password: password,
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
          return handleSignUpUser(userData, password, pendingUsers, setPendingUsers);
        }
        
        toast.success(
          `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
            userData.role !== 'student' ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
          }`
        );
        
        return { success: true };
      } catch (supaError) {
        console.error('Supabase registration error:', supaError);
        return handleSignUpUser(userData, password, pendingUsers, setPendingUsers);
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false };
    }
  };

  const sendVerificationEmail = async (email: string): Promise<{success: boolean, token?: string}> => {
    const pendingUserIndex = pendingUsers.findIndex(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (pendingUserIndex === -1) {
      return { success: false };
    }
    
    const token = pendingUsers[pendingUserIndex].verificationToken;
    console.log(`Verification email resent to ${email} with token: ${token}`);
    console.log(`Verification link: http://localhost:3000/verify-email?token=${token}`);
    
    toast.success(`Հաստատման հղումը կրկին ուղարկված է Ձեր էլ․ փոստին։`);
    
    return { success: true, token };
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    const pendingUserIndex = pendingUsers.findIndex(u => u.verificationToken === token);
    
    if (pendingUserIndex === -1) {
      return false;
    }
    
    const updatedPendingUsers = [...pendingUsers];
    updatedPendingUsers[pendingUserIndex].verified = true;
    
    if (updatedPendingUsers[pendingUserIndex].role === 'student') {
      updatedPendingUsers[pendingUserIndex].registrationApproved = true;
    }
    
    setPendingUsers(updatedPendingUsers);
    return true;
  };

  const approveRegistration = async (userId: string): Promise<boolean> => {
    const pendingUserIndex = pendingUsers.findIndex(u => u.id === userId);
    
    if (pendingUserIndex === -1) {
      return false;
    }
    
    const updatedPendingUsers = [...pendingUsers];
    updatedPendingUsers[pendingUserIndex].registrationApproved = true;
    setPendingUsers(updatedPendingUsers);
    
    return true;
  };

  const switchRole = (role: UserRole) => {
    const userWithRole = mockUsers.find(u => u.role === role);
    if (userWithRole) {
      setUser(userWithRole);
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
    }
  };

  const getPendingUsers = () => {
    return pendingUsers;
  };
  
  const resetAdminAccount = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('reset_admin_account');
      
      if (error) {
        console.error('Error resetting admin account:', error);
        return false;
      }
      
      toast.success('Ադմինիստրատորի հաշիվը վերականգնված է։');
      return true;
    } catch (error) {
      console.error('Error resetting admin account:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        switchRole,
        registerUser,
        sendVerificationEmail,
        verifyEmail,
        approveRegistration,
        getPendingUsers,
        resetAdminAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
