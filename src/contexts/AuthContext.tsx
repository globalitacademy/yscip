
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DBUser, UserRole } from '@/types/database.types';
import { toast } from 'sonner';
import { mockUsers } from '@/data/userRoles';

interface AuthContextType {
  user: DBUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registerUser: (userData: Partial<DBUser>) => Promise<boolean>;
  sendVerificationEmail: (email: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
}

interface PendingUser extends Partial<DBUser> {
  verificationToken: string;
  verified: boolean;
}

let pendingUsers: PendingUser[] = [];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DBUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial session check and user data fetch
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
            setIsAuthenticated(false);
          } else {
            setUser(userData as DBUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setIsAuthenticated(false);
        } else {
          setUser(userData as DBUser);
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // DEMO MODE: For quick testing using mock users
  const demoLogin = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && foundUser.registrationApproved) {
      // Convert mock user to DBUser format
      const dbUser: DBUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.avatar,
        department: foundUser.department,
        course: foundUser.course,
        group_name: foundUser.group,
        organization: foundUser.organization,
        specialization: foundUser.specialization,
        registration_approved: foundUser.registrationApproved || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setUser(dbUser);
      setIsAuthenticated(true);
      localStorage.setItem('DEMO_USER', JSON.stringify(dbUser));
      return true;
    }
    
    return false;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, try mock login first
      if (await demoLogin(email, password)) {
        return true;
      }
      
      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast.error('Մուտքը չի հաջողվել: ' + error.message);
        return false;
      }
      
      if (!data.session) {
        toast.error('Մուտքը չի հաջողվել');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
      return false;
    }
  };

  const logout = async () => {
    // Clear demo user if exists
    localStorage.removeItem('DEMO_USER');
    
    // Real logout
    await supabase.auth.signOut();
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const generateVerificationToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const registerUser = async (userData: Partial<DBUser>): Promise<boolean> => {
    try {
      // For demo mode, store pending users in memory
      const emailExists = mockUsers.some(user => user.email.toLowerCase() === userData.email?.toLowerCase());
      if (emailExists) {
        toast.error(`Այս էլ․ հասցեն արդեն գրանցված է։`);
        return false;
      }
      
      const pendingEmailExists = pendingUsers.some(user => user.email?.toLowerCase() === userData.email?.toLowerCase());
      if (pendingEmailExists) {
        toast.error(`Այս էլ․ հասցեով գրանցումն արդեն սպասման մեջ է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը։`);
        return false;
      }
      
      // Real Supabase registration
      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password: 'password123', // In a real app, this would come from the form
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        toast.error('Գրանցումը չի հաջողվել: ' + error.message);
        return false;
      }
      
      // For demo, also add to pending users
      const verificationToken = generateVerificationToken();
      pendingUsers.push({
        ...userData,
        verificationToken,
        verified: false
      });
      
      console.log(`Verification email sent to ${userData.email} with token: ${verificationToken}`);
      console.log(`Verification link: http://localhost:3000/verify-email?token=${verificationToken}`);
      
      const needsApproval = ['lecturer', 'employer', 'project_manager', 'supervisor'].includes(userData.role as string);
      
      toast.success(
        `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
          needsApproval ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
        }`
      );
      
      return true;
    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
      return false;
    }
  };

  const sendVerificationEmail = async (email: string): Promise<boolean> => {
    // For demo mode
    const pendingUser = pendingUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!pendingUser) {
      return false;
    }
    
    console.log(`Verification email resent to ${email} with token: ${pendingUser.verificationToken}`);
    
    toast.success(`Հաստատման հղումը կրկին ուղարկված է Ձեր էլ․ փոստին։`);
    
    return true;
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    // For demo mode
    const pendingUserIndex = pendingUsers.findIndex(u => u.verificationToken === token);
    
    if (pendingUserIndex === -1) {
      return false;
    }
    
    pendingUsers[pendingUserIndex].verified = true;
    
    if (pendingUsers[pendingUserIndex].role === 'student') {
      const pendingUser = pendingUsers[pendingUserIndex];
      
      // In a real app, this would update a user's status in the database
      // Here we just add them to mock users
      const newUser = {
        id: `user-${Date.now()}`,
        name: pendingUser.name || 'New Student',
        email: pendingUser.email || '',
        role: 'student' as UserRole,
        registrationApproved: true,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      };
      
      mockUsers.push(newUser);
    }
    
    return true;
  };

  const switchRole = async (role: UserRole) => {
    // For demo mode
    const userWithRole = mockUsers.find(u => u.role === role);
    
    if (userWithRole) {
      // Convert mock user to DBUser format
      const dbUser: DBUser = {
        id: userWithRole.id,
        name: userWithRole.name,
        email: userWithRole.email,
        role: userWithRole.role,
        avatar: userWithRole.avatar,
        department: userWithRole.department,
        course: userWithRole.course,
        group_name: userWithRole.group,
        organization: userWithRole.organization,
        specialization: userWithRole.specialization,
        registration_approved: userWithRole.registrationApproved || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setUser(dbUser);
      localStorage.setItem('DEMO_USER', JSON.stringify(dbUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        switchRole,
        registerUser,
        sendVerificationEmail,
        verifyEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
