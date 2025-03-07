
import { useState, useEffect } from 'react';
import { User } from '@/data/userRoles';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated
  };
};
