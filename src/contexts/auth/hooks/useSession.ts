
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';
import { getUserBySession, checkUserApprovalStatus } from '../utils';

export function useSession() {
  const [user, setUser] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(true); // Default to true for students
  const [error, setError] = useState<Error | null>(null);

  console.log('useSession hook initialized');

  const refreshUser = useCallback(async (session: any) => {
    if (!session) {
      console.log('No session to refresh user');
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Refreshing user data for session:', session.user.id);
      setLoading(true);
      setError(null);
      
      const userData = await getUserBySession(session);
      
      if (userData) {
        console.log('User data refreshed successfully:', userData.id);
        setUser(userData);
        
        // Set approval status based on role and registration_approved field
        const approved = userData.role === 'student' || userData.registration_approved;
        setIsApproved(approved);
        console.log('User approval status:', approved);
      } else {
        console.log('Failed to get user data during refresh');
        setUser(null);
        setIsApproved(false);
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setUser(null);
      setIsApproved(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        setLoading(true);
        setError(null);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setError(new Error(error.message));
            setUser(null);
            setIsApproved(false);
          }
          return;
        }
        
        console.log('Initial session check result:', session ? 'Session found' : 'No session');
        
        if (session) {
          console.log('Initial session found, getting user data');
          const userData = await getUserBySession(session);
          
          if (userData && mounted) {
            console.log('Initial user data fetched successfully:', userData.id);
            setUser(userData);
            
            // Set approval status based on role and registration_approved field
            const approved = userData.role === 'student' || userData.registration_approved;
            setIsApproved(approved);
            console.log('User approval status:', approved);
          } else if (mounted) {
            console.log('No user data found for initial session');
            setUser(null);
            setIsApproved(false);
          }
        } else if (mounted) {
          console.log('No session found');
          setUser(null);
          setIsApproved(false);
        }
      } catch (err) {
        console.error('Unexpected error getting initial session:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setUser(null);
          setIsApproved(false);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();
    
    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isApproved,
    loading,
    error,
    setUser,
    refreshUser
  };
}
