
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isDesignatedAdmin, checkFirstAdmin } from '@/contexts/auth/utils';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import ResetAdminForm from './ResetAdminForm';
import { Button } from '@/components/ui/button';

interface AdminSetupProps {
  email?: string | null;
}

export const AdminSetup: React.FC<AdminSetupProps> = ({ email }) => {
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const [designatedAdminMessage, setDesignatedAdminMessage] = useState(false);
  const [showAdminReset, setShowAdminReset] = useState(false);
  const { resetAdminAccount } = useAuth();
  
  useEffect(() => {
    const checkExistingAdmins = async () => {
      const firstAdmin = await checkFirstAdmin();
      setIsFirstAdmin(firstAdmin);
    };
    
    const checkAdminStatus = async () => {
      if (email) {
        const isAdminEmail = await isDesignatedAdmin(email);
        
        if (isAdminEmail) {
          console.log('Admin email detected, ensuring verification and setup');
          setDesignatedAdminMessage(true);
          setShowAdminReset(true);
          
          try {
            // First ensure admin is properly set up in the database
            const { error: ensureError } = await supabase.rpc('ensure_admin_login');
            if (ensureError) {
              console.error('Error ensuring admin account:', ensureError);
              
              // If there's an error, try resetting the admin account
              const resetSuccess = await resetAdminAccount();
              if (!resetSuccess) {
                toast.error('Ադմինի հաշվի ստուգման սխալ', {
                  description: 'Փորձեք վերակայել ադմինի հաշիվը ստորև'
                });
              }
            } else {
              console.log('Admin account ensured successfully');
            }
          } catch (err) {
            console.error('Unexpected error in admin verification:', err);
          }
        } else if (isFirstAdmin) {
          // Check if this could be the first admin
          console.log('Potential first admin detected:', email);
          setIsFirstAdmin(true);
        }
      }
    };

    checkExistingAdmins();
    checkAdminStatus();
  }, [email, resetAdminAccount, isFirstAdmin]);

  const handleResetAdmin = async () => {
    try {
      console.log('Attempting to reset admin account');
      const success = await resetAdminAccount();
      
      if (success) {
        setDesignatedAdminMessage(true);
        toast.success('Ադմինիստրատորի հաշիվը վերակայվել է', {
          description: 'Այժմ կարող եք մուտք գործել օգտագործելով gitedu@bk.ru և Qolej2025* գաղտնաբառը'
        });
      } else {
        toast.error('Հաշվի վերակայման սխալ', {
          description: 'Փորձեք կրկին կամ դիմեք տեխնիկական աջակցության թիմին'
        });
      }
    } catch (error) {
      console.error('Error resetting admin account:', error);
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ'
      });
    }
  };

  const handleAdminLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'gitedu@bk.ru',
        password: 'Qolej2025*'
      });
      
      if (error) {
        console.error('Admin direct login error:', error);
        toast.error('Ադմինի մուտքը չի հաջողվել', {
          description: 'Փորձեք վերակայել ադմինի հաշիվը և փորձել կրկին'
        });
      } else {
        toast.success('Ադմինի մուտքը հաջողվել է', {
          description: 'Ուղղորդվում եք կառավարման վահանակ'
        });
      }
    } catch (err) {
      console.error('Unexpected error during admin login:', err);
      toast.error('Սխալ մուտքի գործընթացի ժամանակ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ'
      });
    }
  };

  return (
    <>
      {isFirstAdmin && (
        <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md">
          Առաջին ադմինիստրատորի հաշիվը կհաստատվի ավտոմատ կերպով
        </div>
      )}
      {designatedAdminMessage && (
        <div className="mt-2 p-3 bg-green-50 text-green-700 rounded-md">
          <p className="font-medium">Ադմինիստրատորի հաշիվը (gitedu@bk.ru) գրանցված է։</p>
          <p className="text-sm mt-1">Օգտագործեք "gitedu@bk.ru" և "Qolej2025*" գաղտնաբառը մուտք գործելու համար:</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 border-green-200 hover:bg-green-100"
            onClick={handleAdminLogin}
          >
            Մուտք որպես ադմին
          </Button>
        </div>
      )}
      {showAdminReset && <ResetAdminForm onReset={handleResetAdmin} />}
    </>
  );
};
