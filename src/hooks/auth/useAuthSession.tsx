
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { PendingUser } from '@/types/auth';
import { usePendingUsers } from './usePendingUsers';
import { useSessionCheck } from './useSessionCheck';
import { useAuthStateChange } from './useAuthStateChange';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract pending users logic to a separate hook
  const { pendingUsers, setPendingUsers } = usePendingUsers();
  
  // Extract session checking logic to a separate hook
  useSessionCheck(setUser, setIsAuthenticated, setIsLoading, pendingUsers);
  
  // Extract auth state change logic to a separate hook
  useAuthStateChange(
    isAuthenticated, 
    setUser, 
    setIsAuthenticated, 
    pendingUsers
  );

  return {
    user,
    isAuthenticated,
    pendingUsers,
    setUser,
    setIsAuthenticated,
    setPendingUsers,
    isLoading
  };
};
