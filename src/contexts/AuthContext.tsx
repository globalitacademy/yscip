import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, mockUsers } from '@/data/userRoles';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registerUser: (userData: Partial<User>) => Promise<boolean>;
  sendVerificationEmail: (email: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
}

interface PendingUser extends Partial<User> {
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && foundUser.registrationApproved) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    const pendingUser = pendingUsers.find(u => 
      u.email?.toLowerCase() === email.toLowerCase() && u.verified && !u.registrationApproved
    );
    
    if (pendingUser) {
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

  const registerUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
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
          needsApproval ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք �� հաստատվի ադմինիստրատորի կողմից։' : ''
        }`
      );
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const sendVerificationEmail = async (email: string): Promise<boolean> => {
    const pendingUser = pendingUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!pendingUser) {
      return false;
    }
    
    console.log(`Verification email resent to ${email} with token: ${pendingUser.verificationToken}`);
    
    toast.success(`Հաստատման հղումը կրկին ուղարկված է Ձեր էլ․ փոստին։`);
    
    return true;
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    const pendingUserIndex = pendingUsers.findIndex(u => u.verificationToken === token);
    
    if (pendingUserIndex === -1) {
      return false;
    }
    
    pendingUsers[pendingUserIndex].verified = true;
    
    if (pendingUsers[pendingUserIndex].role === 'student') {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: pendingUsers[pendingUserIndex].name || 'New Student',
        email: pendingUsers[pendingUserIndex].email || '',
        role: 'student',
        registrationApproved: true,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      };
      
      mockUsers.push(newUser);
    }
    
    return true;
  };

  const switchRole = (role: UserRole) => {
    const userWithRole = mockUsers.find(u => u.role === role);
    if (userWithRole) {
      setUser(userWithRole);
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
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
        verifyEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
