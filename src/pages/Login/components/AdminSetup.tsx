
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isDesignatedAdmin, checkFirstAdmin } from '@/contexts/auth/utils';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import ResetAdminForm from './ResetAdminForm';

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
              
              // Try to auto-login with admin credentials
              try {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                  email: 'gitedu@bk.ru',
                  password: 'Qolej2025*'
                });
                
                if (signInError) {
                  console.log('Admin auto-login attempt failed:', signInError.message);
                  toast.error('Ավտոմատ մուտքը չի հաջողվել', {
                    description: 'Խնդրում ենք մուտք գործել ձեռքով՝ օգտագործելով մուտքի ձևը'
                  });
                } else {
                  console.log('Admin auto-login successful');
                  toast.success('Ադմինիստրատորի հաշիվը հաստատված է', {
                    description: 'Դուք հիմա կուղղորդվեք կառավարման վահանակ'
                  });
                  
                  setTimeout(() => {
                    window.location.href = '/admin';
                  }, 1000);
                }
              } catch (err) {
                console.error('Error in admin auto-login attempt:', err);
              }
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

  return (
    <>
      {isFirstAdmin && (
        <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md">
          Առաջին ադմինիստրատորի հաշիվը կհաստատվի ավտոմատ կերպով
        </div>
      )}
      {designatedAdminMessage && (
        <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md">
          Ադմինիստրատորի հաշիվը (gitedu@bk.ru) գրանցված է։ Մուտք գործեք Ձեր գաղտնաբառով։
        </div>
      )}
      {showAdminReset && <ResetAdminForm onReset={handleResetAdmin} />}
    </>
  );
};
