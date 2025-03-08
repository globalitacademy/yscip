
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSuperAdminInit = () => {
  useEffect(() => {
    const initSuperAdmin = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          console.log('No active session, initializing superadmin...');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    
    initSuperAdmin();
  }, []);
};
