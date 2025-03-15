
import { useState, useEffect } from 'react';
import { PendingUser } from '@/types/auth';

export const usePendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  // Load pending users from localStorage on mount
  useEffect(() => {
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

  return { pendingUsers, setPendingUsers };
};
