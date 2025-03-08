
import { User } from '@/data/userRoles';
import { useAuthCore } from './auth/useAuthCore';
import { useUserRegistration } from './auth/useUserRegistration';
import { useAdminAuth } from './auth/useAdminAuth';
import { mapSupabaseUserToUser } from './auth/authUtils';

export const useAuthAPI = () => {
  const { login, logout, verifyEmail } = useAuthCore();
  const { registerUser } = useUserRegistration();
  const { approveRegistration, getPendingUsers } = useAdminAuth();

  return {
    login,
    logout,
    registerUser,
    verifyEmail,
    approveRegistration,
    getPendingUsers,
    mapSupabaseUserToUser
  };
};
