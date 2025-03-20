
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminActivationInProgress, setAdminActivationInProgress] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Special case for admin login - extra handling
      if (email.toLowerCase() === 'gitedu@bk.ru') {
        console.log("Admin login detected, starting admin login sequence");
        
        // Step 1: First try to ensure admin activation
        setAdminActivationInProgress(true);
        try {
          console.log("Step 1: Ensuring admin activation via edge function");
          const { data: ensureData, error: ensureError } = await supabase.functions.invoke('ensure-admin-activation');
          
          if (ensureError) {
            console.warn("Error ensuring admin access via edge function:", ensureError);
            toast.warning('Կապի սխալ', {
              description: 'Կապ սերվերի հետ չհաջողվեց, փորձում ենք այլընտրանքային տարբերակով մուտք գործել',
            });
          } else {
            console.log("Admin activation successful:", ensureData);
          }
        } catch (ensureErr) {
          console.warn("Exception during admin activation:", ensureErr);
        } finally {
          setAdminActivationInProgress(false);
        }
        
        // Step 2: Short delay to ensure backend changes propagate
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 3: Attempt login with regular flow first
        console.log("Step 3: Attempting regular login flow for admin");
        const regularLoginSuccess = await login(email, password);
        
        if (regularLoginSuccess) {
          console.log("Regular login flow succeeded for admin");
          toast.success('Մուտքն հաջողվել է', {
            description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ',
          });
          navigate('/');
          return;
        }
        
        // Step 4: If regular login fails, try direct login (bypass Supabase auth)
        console.log("Step 4: Regular login failed, trying direct admin login");
        const directLoginSuccess = await login(email, password, true); // This is correct now with the updated type
        
        if (directLoginSuccess) {
          console.log("Direct admin login succeeded");
          toast.success('Մուտքն հաջողվել է', {
            description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ որպես ադմինիստրատոր',
          });
          navigate('/');
        } else {
          console.error("All admin login attempts failed");
          toast.error('Ադմինիստրատորի մուտքը չի հաջողվել', {
            description: 'Խնդրում ենք օգտագործել "Վերականգնել ադմինիստրատորի հաշիվը" կոճակը նախքան մուտք գործելը:',
          });
        }
      } else {
        // Regular user login flow
        const success = await login(email, password);
        
        if (success) {
          toast.success('Մուտքն հաջողվել է', {
            description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ',
          });
          navigate('/');
        } else {
          toast.error('Մուտքը չի հաջողվել', {
            description: 'Էլ․ հասցեն կամ գաղտնաբառը սխալ է կամ Ձեր հաշիվը դեռ ակտիվացված չէ',
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    isLoading,
    adminActivationInProgress,
    handleEmailChange,
    handlePasswordChange,
    handleLogin
  };
};
