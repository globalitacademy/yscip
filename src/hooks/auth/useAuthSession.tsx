
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { PendingUser } from '@/types/auth';
import { useSessionCheck } from './useSessionCheck';
import { useAuthStateChange } from './useAuthStateChange';
import { usePendingUsers } from './usePendingUsers';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load pending users from persisted state or API
  const { pendingUsers, setPendingUsers } = usePendingUsers();

  // Try to restore user from local storage on initial load
  useEffect(() => {
    const storedUserJson = localStorage.getItem('currentUser');
    
    if (storedUserJson) {
      try {
        const storedUser = JSON.parse(storedUserJson);
        setUser(storedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid stored data
        localStorage.removeItem('currentUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Initialize Supabase session
  useSessionCheck(setUser, setIsAuthenticated, setIsLoading, pendingUsers);
  
  // Listen for auth state changes
  useAuthStateChange(isAuthenticated, setUser, setIsAuthenticated, pendingUsers);

  return {
    user,
    isAuthenticated,
    pendingUsers,
    isLoading,
    setUser,
    setIsAuthenticated,
    setPendingUsers
  };
};
