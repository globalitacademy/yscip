
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, mockUsers } from '@/data/userRoles';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registerUser: (userData: Partial<User>) => Promise<{success: boolean, token?: string}>;
  sendVerificationEmail: (email: string) => Promise<{success: boolean, token?: string}>;
  verifyEmail: (token: string) => Promise<boolean>;
  approveRegistration: (userId: string) => Promise<boolean>;
  getPendingUsers: () => any[];
}

interface PendingUser extends Partial<User> {
  verificationToken: string;
  verified: boolean;
  password?: string; // Store password for real login after verification
}

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

// In a real app, this would be stored in a database
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

  // Load users from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const storedPendingUsers = localStorage.getItem('pendingUsers');
    if (storedPendingUsers) {
      setPendingUsers(JSON.parse(storedPendingUsers));
    }
  }, []);

  // Save pendingUsers to localStorage when it changes
  useEffect(() => {
    if (pendingUsers.length > 0) {
      localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
    }
  }, [pendingUsers]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Special case for superadmin
    if (email === 'superadmin@example.com' && password === 'SuperAdmin123') {
      setUser(superAdminUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(superAdminUser));
      return true;
    }
    
    // First, check real registered users (from pendingUsers that are verified)
    const pendingUser = pendingUsers.find(
      u => u.email?.toLowerCase() === email.toLowerCase() && 
      u.verified && 
      u.password === password
    );

    if (pendingUser && pendingUser.registrationApproved) {
      const newUser: User = {
        id: pendingUser.id || `user-${Date.now()}`,
        name: pendingUser.name || 'User',
        email: pendingUser.email || '',
        role: pendingUser.role as UserRole || 'student',
        registrationApproved: true,
        avatar: pendingUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return true;
    }
    
    // If not found in pendingUsers, check mockUsers for demo accounts
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && foundUser.registrationApproved) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    // Check if user exists but is waiting for approval
    const awaitingApprovalUser = pendingUsers.find(u => 
      u.email?.toLowerCase() === email.toLowerCase() && u.verified && !u.registrationApproved
    );
    
    if (awaitingApprovalUser) {
      toast.error(`Ձեր հաշիվը ակտիվացված է, սակայն սպասում է ադմինիստրատորի հաստատման։`);
      return false;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const generateVerificationToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const registerUser = async (userData: Partial<User> & { password?: string }): Promise<{success: boolean, token?: string}> => {
    try {
      // Check if email already exists in mockUsers
      const emailExists = mockUsers.some(user => user.email.toLowerCase() === userData.email?.toLowerCase());
      if (emailExists) {
        toast.error(`Այս էլ․ հասցեն արդեն գրանցված է։`);
        return { success: false };
      }
      
      // Check if email already exists in pendingUsers
      const pendingEmailExists = pendingUsers.some(user => user.email?.toLowerCase() === userData.email?.toLowerCase());
      if (pendingEmailExists) {
        toast.error(`Այս էլ․ հասցեով գրանցումն արդեն սպասման մեջ է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը։`);
        return { success: false };
      }
      
      const verificationToken = generateVerificationToken();
      const password = userData.password; // Store password temporarily
      delete userData.password; // Remove password from userData to not store it directly
      
      const newPendingUser: PendingUser = {
        ...userData,
        id: `user-${Date.now()}`,
        verificationToken,
        verified: false,
        registrationApproved: userData.role === 'student', // Students are auto-approved
        password, // Store password for later login
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      };
      
      setPendingUsers(prev => [...prev, newPendingUser]);
      
      console.log(`Verification email sent to ${userData.email} with token: ${verificationToken}`);
      console.log(`Verification link: http://localhost:3000/verify-email?token=${verificationToken}`);
      
      const needsApproval = ['lecturer', 'employer', 'project_manager', 'supervisor'].includes(userData.role as string);
      
      toast.success(
        `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
          needsApproval ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
        }`
      );
      
      return { success: true, token: verificationToken };
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
    
    // Update the pending user as verified
    const updatedPendingUsers = [...pendingUsers];
    updatedPendingUsers[pendingUserIndex].verified = true;
    setPendingUsers(updatedPendingUsers);
    
    // For students, auto-approve and add to real accounts
    if (updatedPendingUsers[pendingUserIndex].role === 'student') {
      updatedPendingUsers[pendingUserIndex].registrationApproved = true;
    }
    
    return true;
  };

  const approveRegistration = async (userId: string): Promise<boolean> => {
    const pendingUserIndex = pendingUsers.findIndex(u => u.id === userId);
    
    if (pendingUserIndex === -1) {
      return false;
    }
    
    // Approve the registration
    const updatedPendingUsers = [...pendingUsers];
    updatedPendingUsers[pendingUserIndex].registrationApproved = true;
    setPendingUsers(updatedPendingUsers);
    
    return true;
  };

  const switchRole = (role: UserRole) => {
    // For demo purposes, allow switching between mockUsers
    const userWithRole = mockUsers.find(u => u.role === role);
    if (userWithRole) {
      setUser(userWithRole);
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
    }
  };

  const getPendingUsers = () => {
    return pendingUsers;
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
        getPendingUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
