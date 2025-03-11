
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { resetAdminAccount } from '@/contexts/auth/operations/authOperations';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

const ResetAdminForm: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  
  const handleReset = async () => {
    setIsResetting(true);
    
    try {
      console.log('Calling resetAdminAccount function');
      const success = await resetAdminAccount();
      if (success) {
        toast.success('Հաշիվը վերակայվել է', {
          description: 'Այժմ կարող եք մուտք գործել gitedu@bk.ru և Qolej2025* օգտագործելով'
        });
        // Reload the page to reset the form to login state
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
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
            {isResetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Վերակայում...
              </>
            ) : 'Վերակայել Ադմինի հաշիվը'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ադմինի հաշվի վերակայում</AlertDialogTitle>
            <AlertDialogDescription>
              Այս գործողությունը կջնջի ադմինի հաշիվը (gitedu@bk.ru) և կստեղծի նորը՝ նախասահմանված գաղտնաբառով: 
              Դուք կկարողանաք մուտք գործել օգտագործելով gitedu@bk.ru և Qolej2025* գաղտնաբառը:
              Շարունակե՞լ:
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
