
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
          setDesignatedAdminMessage(true);
          setShowAdminReset(true);
          
          // Ensure admin is verified
          try {
            console.log('Verifying designated admin account from AdminSetup');
            const { error } = await supabase.rpc('verify_designated_admin');
            if (error) {
              console.error('Error verifying designated admin:', error);
              toast.error('Ադմինի հաշվի ստուգման սխալ', {
                description: 'Փորձեք վերակայել ադմինի հաշիվը ստորև'
              });
            } else {
              console.log('Successfully verified designated admin');
              
              // Try to auto-login if this is the admin email
              try {
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) {
                  console.error('Error getting session for admin auto-login:', sessionError);
                } else if (!sessionData.session) {
                  console.log('No active session, trying admin auto-login');
                  
                  const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: 'gitedu@bk.ru',
                    password: 'Qolej2025*'
                  });
                  
                  if (signInError) {
                    console.log('Admin auto-login attempt failed:', signInError.message);
                  } else {
                    console.log('Admin auto-login successful');
                    setTimeout(() => {
                      window.location.href = '/admin';
                    }, 1000);
                  }
                }
              } catch (autoLoginErr) {
                console.error('Error in admin auto-login attempt:', autoLoginErr);
              }
            }
          } catch (err) {
            console.error('Unexpected error verifying admin:', err);
          }
        }
      }
    };

    checkExistingAdmins();
    checkAdminStatus();
  }, [email]);

  const handleResetAdmin = async () => {
    try {
      console.log('Attempting to reset admin account from AdminSetup');
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
