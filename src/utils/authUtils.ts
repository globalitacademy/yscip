
import { User } from '@/data/userRoles';
import { PendingUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const handleFallbackLogin = (
  email: string, 
  password: string,
  pendingUsers: PendingUser[],
  mockUsers: User[],
  setUser: (user: User | null) => void,
  setIsAuthenticated: (value: boolean) => void,
) => {
  // Check real registered users (from pendingUsers that are verified)
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
      role: pendingUser.role as any || 'student',
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

export const handleSignUpUser = async (
  userData: Partial<User> & { password: string },
  pendingUsers: PendingUser[],
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>,
) => {
  const verificationToken = generateVerificationToken();
    
  const newPendingUser: PendingUser = {
    ...userData,
    id: `user-${Date.now()}`,
    verificationToken,
    verified: false,
    registrationApproved: userData.role === 'student',
    password: userData.password,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
  };
  
  setPendingUsers(prevUsers => [...prevUsers, newPendingUser]);
  
  console.log(`Verification email sent to ${userData.email} with token: ${verificationToken}`);
  console.log(`Verification link: http://localhost:3000/verify-email?token=${verificationToken}`);
  
  toast.success(
    `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
      userData.role !== 'student' ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
    }`
  );
  
  return { success: true, token: verificationToken };
};
