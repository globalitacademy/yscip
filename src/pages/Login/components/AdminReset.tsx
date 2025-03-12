
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';

export const AdminReset: React.FC = () => {
  const { resetAdmin, login } = useAuth();
  const [isResetting, setIsResetting] = React.useState(false);
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleResetAdmin = async () => {
    setIsResetting(true);
    try {
      const success = await resetAdmin();
      
      if (success) {
        toast.success('Ադմինիստրատորի հաշիվը վերակայվել է', {
          description: 'Այժմ կարող եք մուտք գործել օգտագործելով gitedu@bk.ru և Qolej2025* գաղտնաբառը'
        });
      } else {
        toast.error('Սխալ ադմինի հաշվի վերակայման ժամանակ');
      }
    } catch (error) {
      console.error('Error resetting admin account:', error);
      toast.error('Սխալ ադմինի հաշվի վերակայման ժամանակ');
    } finally {
      setIsResetting(false);
    }
  };

  const handleAdminLogin = async () => {
    setIsLoggingIn(true);
    try {
      // Reset admin first to ensure it exists
      await resetAdmin();
      
      // Try to login with admin credentials
      const success = await login('gitedu@bk.ru', 'Qolej2025*');
      
      if (!success) {
        toast.error('Ադմինի մուտքը չի հաջողվել', {
          description: 'Փորձեք կրկին վերակայել ադմինի հաշիվը'
        });
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      toast.error('Սխալ ադմինի մուտքի ժամանակ');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-700">
        <h3 className="font-medium mb-1">Ադմինիստրատորի հաշիվ</h3>
        <p className="text-sm mb-2">
          Օգտագործեք <strong>gitedu@bk.ru</strong> էլ. հասցեն և <strong>Qolej2025*</strong> գաղտնաբառը որպես ադմին մուտք գործելու համար։
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleAdminLogin}
            variant="outline"
            size="sm"
            className="w-full border-blue-200 hover:bg-blue-100"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Մուտք...
              </>
            ) : 'Մուտք որպես ադմին'}
          </Button>
          
          <Button
            onClick={handleResetAdmin}
            variant="outline"
            size="sm"
            className="w-full border-blue-200 hover:bg-blue-100"
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
      </div>
    </div>
  );
};
