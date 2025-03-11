
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
        onReset();
      }
    } catch (err) {
      console.error('Error resetting admin account:', err);
      toast.error('Սխալ ադմինի հաշվի վերակայման ժամանակ');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Սեղմեք ստորև՝ ադմինիստրատորի հաշիվը վերականգնելու համար։ Սա կհեռացնի ընթացիկ ադմինիստրատորի հաշիվը և հնարավորություն կտա գրանցել նոր հաշիվ։
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
