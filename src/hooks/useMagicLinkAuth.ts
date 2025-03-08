
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMagicLinkAuth = (setIsLoading: (loading: boolean) => void) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkForMagicLink = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        try {
          setIsLoading(true);
          console.log('Magic Link detected in URL, processing...');
          
          // Supabase-ն ինքնաբերաբար կմշակի մուտքի տվյալները hash-ից
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Magic link error:', error);
            toast.error('Magic link-ով մուտքի սխալ: ' + error.message);
          } else if (data?.session) {
            console.log('Magic link login successful!');
            toast.success('Հաջողությամբ մուտք գործվեց Magic Link-ի միջոցով');
            navigate('/');
          }
        } catch (error) {
          console.error('Magic link processing error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    checkForMagicLink();
  }, [navigate, setIsLoading]);
};
