
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isDesignatedAdmin, checkFirstAdmin } from '@/contexts/auth/utils';
import { supabase } from '@/integrations/supabase/client';
import ResetAdminForm from './ResetAdminForm';

interface AdminSetupProps {
  email?: string | null;
}

export const AdminSetup: React.FC<AdminSetupProps> = ({ email }) => {
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const [designatedAdminMessage, setDesignatedAdminMessage] = useState(false);
  const [showAdminReset, setShowAdminReset] = useState(false);
  
  useEffect(() => {
    const checkExistingAdmins = async () => {
      const firstAdmin = await checkFirstAdmin();
      setIsFirstAdmin(firstAdmin);
    };
    
    const checkAdminStatus = async () => {
      if (email && email === 'gitedu@bk.ru') {
        setDesignatedAdminMessage(true);
        setShowAdminReset(true);
        
        if (await isDesignatedAdmin(email)) {
          try {
            const { data, error } = await supabase.auth.updateUser({
              data: { email_confirmed: true }
            });
            
            if (error) {
              console.error('Error updating admin metadata:', error);
            } else {
              console.log('Successfully updated admin metadata', data);
            }
          } catch (err) {
            console.error('Unexpected error updating admin:', err);
          }
        }
      }
    };

    checkExistingAdmins();
    checkAdminStatus();
  }, [email]);

  const handleResetAdmin = () => {
    setDesignatedAdminMessage(true);
    toast.success('Ադմինիստրատորի հաշիվը վերակայվել է', {
      description: 'Այժմ կարող եք մուտք գործել օգտագործելով gitedu@bk.ru և Qolej2025* գաղտնաբառը'
    });
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
