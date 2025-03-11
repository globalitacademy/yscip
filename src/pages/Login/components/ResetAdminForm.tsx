
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { resetAdminAccount } from '@/contexts/auth/operations/authOperations';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            disabled={isResetting}
          >
            {isResetting ? 'Վերակայում...' : 'Վերակայել Ադմինի հաշիվը'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ադմինի հաշվի վերակայում</AlertDialogTitle>
            <AlertDialogDescription>
              Այս գործողությունը կջնջի ադմինի հաշիվը (gitedu@bk.ru)։ 
              Դուք պետք է կրկին գրանցվեք այդ էլ․ հասցեով։ 
              Շարունակե՞լ։
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700"
            >
              Վերակայել
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className="text-xs text-muted-foreground mt-1">
        Օգտագործեք սա միայն եթե ադմինի հաշիվը (gitedu@bk.ru) մուտքի խնդիրներ ունի
      </p>
    </div>
  );
};

export default ResetAdminForm;
