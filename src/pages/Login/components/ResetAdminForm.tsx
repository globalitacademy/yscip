
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { resetAdminAccount } from '@/contexts/auth/operations/authOperations';

const ResetAdminForm: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  
  const handleReset = async () => {
    setIsResetting(true);
    
    try {
      const success = await resetAdminAccount();
      if (success) {
        toast.success('Հաշիվը վերակայվել է', {
          description: 'Կարող եք կրկին գրանցվել որպես ադմին'
        });
      }
    } catch (error) {
      console.error('Error in reset admin process:', error);
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ'
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div className="mt-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        onClick={handleReset}
        disabled={isResetting}
      >
        {isResetting ? 'Վերակայում...' : 'Վերակայել Ադմինի հաշիվը'}
      </Button>
      <p className="text-xs text-muted-foreground mt-1">
        Օգտագործեք սա միայն եթե ադմինի հաշիվը (gitedu@bk.ru) մուտքի խնդիրներ ունի
      </p>
    </div>
  );
};

export default ResetAdminForm;
