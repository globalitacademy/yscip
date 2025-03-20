
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminReset: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { resetAdminAccount } = useAuth();
  
  const handleResetAdmin = async () => {
    setIsResetting(true);
    try {
      // First try to ensure admin activation using edge function
      const { data: ensureData, error: ensureError } = await supabase.functions.invoke('ensure-admin-activation');
      
      if (ensureError) {
        console.error('Error ensuring admin access:', ensureError);
        // Fall back to resetAdminAccount
        const success = await resetAdminAccount();
        if (success) {
          setResetSuccess(true);
          toast.success('Ադմինիստրատորի հաշիվը վերականգնված է', {
            description: 'Email: gitedu@bk.ru, Գաղտնաբառ: Qolej2025*'
          });
        } else {
          toast.error('Սխալ', {
            description: 'Չհաջողվեց վերականգնել ադմինիստրատորի հաշիվը'
          });
        }
      } else {
        console.log('Admin activation succeeded:', ensureData);
        setResetSuccess(true);
        toast.success('Ադմինիստրատորի հաշիվը վերականգնված է', {
          description: 'Email: gitedu@bk.ru, Գաղտնաբառ: Qolej2025*'
        });
      }
    } catch (error) {
      console.error('Error resetting admin:', error);
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ'
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ադմինիստրատորի հաշիվ</CardTitle>
        <CardDescription>
          Վերականգնեք համակարգի գլխավոր ադմինիստրատորի հաշիվը
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTitle>Ադմինիստրատորի հաշվի մանրամասներ</AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <div><strong>Էլ. հասցե:</strong> gitedu@bk.ru</div>
              <div><strong>Գաղտնաբառ:</strong> Qolej2025*</div>
            </div>
          </AlertDescription>
        </Alert>
        
        {resetSuccess && (
          <div className="bg-green-50 p-3 rounded-md flex items-center text-green-700 mb-3">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Ադմինիստրատորի հաշիվը հաջողությամբ վերականգնված է</span>
          </div>
        )}
        
        <Button 
          onClick={handleResetAdmin} 
          disabled={isResetting}
          className="w-full"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
          {isResetting ? 'Վերականգնում...' : 'Վերականգնել ադմինիստրատորի հաշիվը'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminReset;
