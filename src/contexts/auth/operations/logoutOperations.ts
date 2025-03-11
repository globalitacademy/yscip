
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const logout = async (): Promise<void> => {
  try {
    console.log('Logging out user');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      toast.error('Ելքը չի հաջողվել', {
        description: error.message
      });
      return;
    }
    
    toast.success('Ելքն հաջողվել է', {
      description: 'Դուք հաջողությամբ դուրս եք եկել համակարգից'
    });
  } catch (error) {
    console.error('Unexpected logout error:', error);
    toast.error('Սխալ', {
      description: 'Տեղի ունեցավ անսպասելի սխալ'
    });
  }
};
