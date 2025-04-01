
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const executeLogout = async (
  setUser: (user: null) => void,
  setIsAuthenticated: (value: boolean) => void
): Promise<void> => {
  try {
    console.log('Logging out user');
    await supabase.auth.signOut();
    toast.info('Դուք դուրս եք եկել համակարգից։');
  } catch (error) {
    console.error('Error during logout:', error);
    toast.error('Սխալ դուրս գալու ընթացքում։');
  }
  setUser(null);
  setIsAuthenticated(false);
  localStorage.removeItem('currentUser');
};
