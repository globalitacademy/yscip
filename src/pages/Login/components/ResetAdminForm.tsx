
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { resetAdminAccount } from '@/contexts/auth/operations';

interface ResetAdminFormProps {
  onReset: () => void;
}

const ResetAdminForm: React.FC<ResetAdminFormProps> = ({ onReset }) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetAdmin = async () => {
    setIsResetting(true);
    try {
      const success = await resetAdminAccount();
      
      if (success) {
        toast.success('Ադմինիստրատորի հաշիվը վերակայվել է', {
          description: 'Այժմ կարող եք մուտք գործել օգտագործելով gitedu@bk.ru և Qolej2025* գաղտնաբառը'
        });
        onReset();
      } else {
        toast.error('Սխալ ադմինի հաշվի վերակայման ժամանակ', {
          description: 'Խնդրում ենք փորձել կրկին'
        });
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
      <p className="text-sm text-gray-500">
        Սեղմեք ստորև՝ ադմինիստրատորի հաշիվը վերականգնելու համար։
      </p>
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
