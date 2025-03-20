
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
      // Special case for admin login - try to ensure admin access first
      if (email.toLowerCase() === 'gitedu@bk.ru') {
        console.log("Admin login detected, trying to ensure admin access first");
        try {
          const { error: ensureError } = await supabase.functions.invoke('ensure-admin-activation');
          if (ensureError) {
            console.warn("Error ensuring admin access, but proceeding with login:", ensureError);
          }
        } catch (ensureErr) {
          console.warn("Exception when ensuring admin access, but proceeding with login:", ensureErr);
        }
      }

      const success = await login(email, password);
      
      if (success) {
        toast.success('Մուտքն հաջողվել է', {
          description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ',
        });
        navigate('/');
      } else {
        if (email.toLowerCase() === 'gitedu@bk.ru') {
          toast.error('Ադմինիստրատորի մուտքը չի հաջողվել', {
            description: 'Խնդրում ենք օգտագործել "Վերականգնել ադմինիստրատորի հաշիվը" կոճակը նախքան մուտք գործելը:',
          });
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
    handleEmailChange,
    handlePasswordChange,
    handleLogin
  };
};
