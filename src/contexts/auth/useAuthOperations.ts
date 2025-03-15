
import { User } from '@/types/user';
import { PendingUser, DemoAccount } from '@/types/auth';
import { useLoginOperations } from './operations/loginOperations';
import { useRegistrationOperations } from './operations/registrationOperations';
import { useDemoAccountOperations } from './operations/demoAccountOperations';

export const useAuthOperations = (
  user: User | null,
  pendingUsers: PendingUser[],
  demoAccounts: DemoAccount[] | undefined,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>,
  setDemoAccounts: React.Dispatch<React.SetStateAction<DemoAccount[]>>
) => {
  // Login operations
  const { 
    login, 
    logout 
  } = useLoginOperations(pendingUsers, demoAccounts, setUser, setIsAuthenticated);

  // Registration operations
  const { 
    registerUser 
  } = useRegistrationOperations(pendingUsers, demoAccounts, setPendingUsers);

  // Demo account operations
  const { 
    manageDemoAccount 
  } = useDemoAccountOperations(demoAccounts, setDemoAccounts);

  return {
    login,
    logout,
    registerUser,
    manageDemoAccount
  };
};
