
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ResetAdminFormProps {
  onReset: () => void;
}

const ResetAdminForm: React.FC<ResetAdminFormProps> = ({ onReset }) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetAdmin = async () => {
    setIsResetting(true);
    try {
      // Call the RPC function directly
      const { data, error } = await supabase.rpc('reset_admin_account');
      
      if (error) {
        console.error('Error resetting admin account:', error);
        toast.error('Սխալ ադմինի հաշվի վերակայման ժամանակ', {
          description: error.message
        });
      } else {
        console.log('Admin account reset successful, result:', data);
        
        // Ensure the admin account is properly set up in auth.users
        await supabase.rpc('ensure_admin_login');
        
        toast.success('Ադմինիստրատորի հաշիվը վերակայվել է', {
          description: 'Այժմ կարող եք մուտք գործել օգտագործելով gitedu@bk.ru և Qolej2025* գաղտնաբառը'
        });
        
        onReset();
        
        // Try to login automatically
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: 'gitedu@bk.ru',
          password: 'Qolej2025*'
        });
        
        if (loginError) {
          console.error('Auto login failed after reset:', loginError);
          toast.error('Ավտոմատ մուտքը չի հաջողվել', {
            description: 'Խնդրում ենք մուտք գործել ձեռքով'
          });
        } else {
          toast.success('Ավտոմատ մուտքը հաջողվել է');
        }
      }
    } catch (err) {
      console.error('Error resetting admin account:', err);
      toast.error('Սխալ ադմինի հաշվի վերակայման ժամանակ');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-2 text-blue-700">
        <p className="text-sm">
          Ադմինի հաշիվը վերակայելու համար սեղմեք ստորև գտնվող կոճակը։
          Հաշիվը հաջողությամբ վերակայելուց հետո մուտք գործեք՝ օգտագործելով <strong>gitedu@bk.ru</strong> էլ. հասցեն և <strong>Qolej2025*</strong> գաղտնաբառը։
        </p>
      </div>
      <Button
        onClick={handleResetAdmin}
        variant="destructive"
        className="w-full"
        disabled={isResetting}
      >
        {isResetting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Վերակայում...
          </>
        ) : 'Վերակայել ադմինի հաշիվը'}
      </Button>
    </div>
  );
};

export default ResetAdminForm;
