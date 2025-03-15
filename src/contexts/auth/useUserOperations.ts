
import { User, UserRole } from '@/types/user';
import { PendingUser } from '@/types/auth';
import { useAdminOperations } from './operations/adminOperations';
import { useUserVerificationOperations } from './operations/userVerificationOperations';

export const useUserOperations = (
  pendingUsers: PendingUser[],
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>,
  setUser: (user: User | null) => void
) => {
  // Admin operations
  const {
    switchRole,
    getPendingUsers,
    resetAdminAccount,
    registerRealAccount
  } = useAdminOperations(setPendingUsers, setUser);

  // User verification operations
  const {
    sendVerificationEmail,
    verifyEmail,
    approveRegistration
  } = useUserVerificationOperations(pendingUsers, setPendingUsers);

  return {
    switchRole,
    sendVerificationEmail,
    verifyEmail,
    approveRegistration,
    getPendingUsers,
    resetAdminAccount,
    registerRealAccount
  };
};
