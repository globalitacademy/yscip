
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Define types
type UserRole = 'admin' | 'lecturer' | 'instructor' | 'project_manager' | 'supervisor' | 'employer' | 'student';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, organization?: string) => Promise<boolean>;
  resetAdmin: () => Promise<boolean>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
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
          } else if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role as UserRole,
              organization: userData.organization
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user data after sign in:', error);
          setUser(null);
        } else if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role as UserRole,
            organization: userData.organization
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Special handling for admin
      if (email.trim().toLowerCase() === 'gitedu@bk.ru') {
        // Reset admin account first to ensure it exists
        await resetAdmin();
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error('Մուտքի սխալ', {
          description: error.message
        });
        return false;
      }

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
        } else if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role as UserRole,
            organization: userData.organization
          });
        }
        
        toast.success('Մուտքը հաջողվել է');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Ելքի սխալ', {
          description: error.message
        });
      } else {
        setUser(null);
        toast.success('Դուք հաջողությամբ դուրս եք եկել համակարգից');
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole,
    organization?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Special handling for admin
      if (email.trim().toLowerCase() === 'gitedu@bk.ru') {
        await resetAdmin();
        toast.success('Ադմինի հաշիվը վերակայվել է', {
          description: 'Այժմ կարող եք մուտք գործել օգտագործելով gitedu@bk.ru և Qolej2025* գաղտնաբառը'
        });
        return true;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast.error('Գրանցման սխալ', {
          description: error.message
        });
        return false;
      }

      if (data.user) {
        // Insert user data to public.users table
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email,
              name,
              role,
              organization,
              registration_approved: true // Auto approve everyone
            }
          ]);

        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }
        
        toast.success('Գրանցումը հաջողվել է', {
          description: 'Դուք կարող եք մուտք գործել համակարգ'
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset admin account
  const resetAdmin = async (): Promise<boolean> => {
    try {
      console.log('Resetting admin account');
      
      // Call the reset_admin_account function
      const { data, error } = await supabase.rpc('reset_admin_account');
      
      if (error) {
        console.error('Error resetting admin account:', error);
        return false;
      }
      
      console.log('Admin account reset successful, result:', data);
      return true;
    } catch (error) {
      console.error('Unexpected error resetting admin account:', error);
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    resetAdmin
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
