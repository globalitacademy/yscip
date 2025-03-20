
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminReset: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetStatus, setResetStatus] = useState<{[key: string]: boolean} | null>(null);
  const { resetAdminAccount } = useAuth();
  
  const handleResetAdmin = async () => {
    setIsResetting(true);
    setResetStatus(null);
    
    try {
      // Show initial progress notification
      toast.loading('Ադմինիստրատորի հաշվի վերակտիվացում...', {
        id: 'admin-reset',
        duration: 10000,
      });
      
      // First try to ensure admin activation using edge function
      console.log('Calling ensure-admin-activation function...');
      const { data: ensureData, error: ensureError } = await supabase.functions.invoke('ensure-admin-activation');
      
      if (ensureError) {
        console.error('Error ensuring admin access via edge function:', ensureError);
        toast.error('Սխալ սերվերի հարցման ժամանակ', {
          id: 'admin-reset',
          description: 'Փորձում ենք այլընտրանքային մեթոդ...'
        });
        
        // Fall back to resetAdminAccount
        const success = await resetAdminAccount();
        setResetStatus({
          edgeFunction: false,
          fallback: success
        });
        
        if (success) {
          setResetSuccess(true);
          toast.success('Ադմինիստրատորի հաշիվը վերականգնված է', {
            id: 'admin-reset',
            description: 'Email: gitedu@bk.ru, Գաղտնաբառ: Qolej2025*'
          });
        } else {
          toast.error('Սխալ', {
            id: 'admin-reset',
            description: 'Չհաջողվեց վերականգնել ադմինիստրատորի հաշիվը'
          });
        }
      } else {
        console.log('Admin activation succeeded:', ensureData);
        setResetSuccess(true);
        setResetStatus({
          edgeFunction: true,
          steps: ensureData.steps
        });
        
        toast.success('Ադմինիստրատորի հաշիվը վերականգնված է', {
          id: 'admin-reset',
          description: 'Email: gitedu@bk.ru, Գաղտնաբառ: Qolej2025*'
        });
        
        // Try to log in automatically
        try {
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email: 'gitedu@bk.ru',
            password: 'Qolej2025*'
          });
          
          if (loginError) {
            console.error('Auto login failed:', loginError);
            // Second login attempt with short delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const { error: retryError } = await supabase.auth.signInWithPassword({
              email: 'gitedu@bk.ru',
              password: 'Qolej2025*'
            });
            
            if (!retryError) {
              console.log('Auto login successful on retry');
              toast.success('Ավտոմատ մուտք է կատարվել');
            } else {
              console.error('Retry auto login failed:', retryError);
              toast.warning('Ավտոմատ մուտքը չհաջողվեց', {
                description: 'Խնդրում ենք փորձել ձեռքով մուտք գործել'
              });
            }
          } else {
            console.log('Auto login successful');
            toast.success('Ավտոմատ մուտք է կատարվել');
          }
        } catch (loginErr) {
          console.error('Error during auto login:', loginErr);
        }
      }
    } catch (error) {
      console.error('Error resetting admin:', error);
      toast.error('Սխալ', {
        id: 'admin-reset',
        description: 'Տեղի ունեցավ անսպասելի սխալ'
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-500" />
          Ադմինիստրատորի հաշիվ
        </CardTitle>
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
        
        {resetStatus && resetStatus.edgeFunction && (
          <div className="text-xs bg-slate-50 p-2 rounded border border-slate-200">
            <div className="font-semibold mb-1">Կարգավիճակ:</div>
            {Object.entries(resetStatus.steps || {}).map(([key, value]) => (
              <div key={key} className="flex items-center">
                {value ? (
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                )}
                <span>{key}: {value ? 'OK' : 'Fail'}</span>
              </div>
            ))}
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
