
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';
import { getUserBySession, checkUserApprovalStatus } from '../utils';

export function useSession() {
  const [user, setUser] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(true); // Միշտ հաստատված է
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
        
        // Միշտ հաստատված է, անկախ դերից և registration_approved դաշտից
        setIsApproved(true);
        console.log('User is always approved now');
      } else {
        console.log('Failed to get user data during refresh');
        setUser(null);
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setUser(null);
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
            
            // Միշտ հաստատված է
            setIsApproved(true);
            console.log('User is always approved now');
          } else if (mounted) {
            console.log('No user data found for initial session');
            setUser(null);
          }
        } else if (mounted) {
          console.log('No session found');
          setUser(null);
        }
      } catch (err) {
        console.error('Unexpected error getting initial session:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();
    
    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed, event:', _event);
      if (mounted) {
        refreshUser(session);
      }
    });
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshUser]);

  return {
    user,
    isAuthenticated: !!user,
    isApproved: true, // Միշտ վերադարձնել true
    loading,
    error,
    setUser,
    refreshUser
  };
}
