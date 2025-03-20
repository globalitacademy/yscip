
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { authService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '@/types/auth';

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin1",
    registrationApproved: true
  },
  {
    id: "lecturer1",
    name: "Lecturer User",
    email: "lecturer@example.com",
    role: "lecturer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lecturer1",
    department: "Ինֆորմատիկայի ֆակուլտետ",
    registrationApproved: true
  },
  {
    id: "student1",
    name: "Student User",
    email: "student@example.com",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student1",
    course: "Կիրառական մաթեմատիկա",
    group: "ԿՄ-021",
    department: "Ինֆորմատիկայի ֆակուլտետ",
    registrationApproved: true
  }
];

// Create the context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  switchRole: () => {},
  registerUser: async () => ({ success: false }),
  sendVerificationEmail: async () => ({ success: false }),
  verifyEmail: async () => false,
  approveRegistration: async () => false,
  getPendingUsers: () => [],
  resetAdminAccount: async () => false
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  // Check for session on initial load
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        // Get current authenticated user
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Demo login with email and password
  const login = async (email: string, password: string, directAdminLogin: boolean = false) => {
    setIsLoading(true);
    try {
      // Check if we should use demo/mock login
      const useMockLogin = import.meta.env.VITE_USE_MOCK_AUTH === "true";
      
      if (useMockLogin) {
        // Demo login logic
        const mockUser = mockUsers.find(u => u.email === email);
        if (mockUser && password === "password") {
          setUser(mockUser);
          return true;
        }
        return false;
      } else {
        // Real authentication with Supabase
        let response;
        
        if (directAdminLogin && email.toLowerCase() === 'gitedu@bk.ru') {
          // Use direct admin login bypass
          response = await authService.loginAdmin(email, password);
        } else {
          // Standard login
          response = await authService.login(email, password);
        }
        
        if (response.success && response.user) {
          setUser(response.user);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === "true";
      
      if (useMockAuth) {
        // Demo logout
        setUser(null);
      } else {
        // Real logout with Supabase
        await authService.logout();
        setUser(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes: switch between roles
  const switchRole = (role: UserRole) => {
    if (!user) return;
    
    const mockUserForRole = mockUsers.find(u => u.role === role);
    if (mockUserForRole) {
      setUser(mockUserForRole);
    }
  };

  // Registration function
  const registerUser = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true);
    try {
      const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === "true";
      
      if (useMockAuth) {
        // Demo registration
        const newUser: User = {
          id: `demo-${Date.now()}`,
          name: userData.name || "",
          email: userData.email || "",
          role: userData.role || "student",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
          registrationApproved: false,
          department: userData.department,
          course: userData.course,
          group: userData.group,
          organization: userData.organization
        };
        
        setPendingUsers([...pendingUsers, {
          ...newUser,
          verificationToken: "demo-token",
          verified: false,
          password: userData.password
        }]);
        
        return {
          success: true,
          token: "demo-token"
        };
      } else {
        // Real registration with Supabase
        const response = await authService.register(userData);
        return {
          success: response.success,
          token: response.success ? "verification-sent" : undefined
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to simulate sending verification email
  const sendVerificationEmail = async (email: string) => {
    const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === "true";
    
    if (useMockAuth) {
      // Demo verification
      const pendingUser = pendingUsers.find(u => u.email === email);
      
      if (pendingUser) {
        return {
          success: true,
          token: pendingUser.verificationToken
        };
      }
      return { success: false };
    } else {
      // In a real implementation, this would send an email with Supabase
      // For now, we return success
      return { success: true };
    }
  };

  // Mock function to verify email token
  const verifyEmail = async (token: string) => {
    const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === "true";
    
    if (useMockAuth) {
      // Demo verification
      const updatedPendingUsers = pendingUsers.map(u => {
        if (u.verificationToken === token) {
          return { ...u, verified: true };
        }
        return u;
      });
      
      setPendingUsers(updatedPendingUsers);
      return true;
    } else {
      // In a real implementation, this would verify the token with Supabase
      // For now, we return success
      return true;
    }
  };

  // Mock function to approve registration
  const approveRegistration = async (userId: string) => {
    const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === "true";
    
    if (useMockAuth) {
      // Demo approval
      let approvedUser = null;
      
      const updatedPendingUsers = pendingUsers.filter(u => {
        if (u.id === userId) {
          approvedUser = { ...u, registrationApproved: true };
          return false;
        }
        return true;
      });
      
      setPendingUsers(updatedPendingUsers);
      
      if (approvedUser) {
        // Add the approved user to mock users
        mockUsers.push(approvedUser as User);
        return true;
      }
      return false;
    } else {
      try {
        // Update the user registration_approved field
        const { error } = await supabase
          .from('users')
          .update({ registration_approved: true })
          .eq('id', userId);
          
        return !error;
      } catch (error) {
        console.error('Error approving registration:', error);
        return false;
      }
    }
  };

  // Function to get pending users
  const getPendingUsers = () => {
    return pendingUsers.filter(u => u.verified && !u.registrationApproved);
  };

  // Function to reset admin account
  const resetAdminAccount = async () => {
    try {
      const { data, error } = await supabase.rpc('reset_admin_account');
      
      if (error) {
        console.error('Error resetting admin account:', error);
        return false;
      }
      
      return data;
    } catch (error) {
      console.error('Error in resetAdminAccount:', error);
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    switchRole,
    registerUser,
    sendVerificationEmail,
    verifyEmail,
    approveRegistration,
    getPendingUsers,
    resetAdminAccount
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy consumption of auth context
export const useAuth = () => useContext(AuthContext);
