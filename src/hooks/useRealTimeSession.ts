
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/user';
import { toast } from 'sonner';

export const useRealTimeSession = () => {
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await syncUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error fetching initial session:', error);
        toast.error('Սխալ սեսիայի տվյալները բեռնելիս');
      } finally {
        setIsLoading(false);
      }
    };

    // Sync user data from database
    const syncUserData = async (userId: string) => {
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (userData) {
          const user: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role as UserRole,
            avatar: userData.avatar,
            department: userData.department,
            registrationApproved: userData.registration_approved,
            organization: userData.organization,
            course: userData.course,
            // Use group_name from database for the group property
            group: userData.group_name,
            specialization: userData.specialization
          };
          
          setSessionUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Set up real-time auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        await syncUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setSessionUser(null);
        localStorage.removeItem('currentUser');
      } else if (event === 'USER_UPDATED' && session) {
        await syncUserData(session.user.id);
      }
    });

    // Initialize session
    getInitialSession();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user: sessionUser, isLoading };
};
