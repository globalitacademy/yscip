
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { LoginContainer } from './components/LoginContainer';
import { RedirectHandler } from './components/RedirectHandler';
import { RegisterUserData } from './types';
import { isDesignatedAdmin } from '@/contexts/auth/utils';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const { login, registerUser, user, isAuthenticated, isApproved } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showAdminReset, setShowAdminReset] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkParams = async () => {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.hash.substring(1));
      const emailParam = params.get('email');
      
      if (params.get('admin_reset') === 'true') {
        setShowAdminReset(true);
      }
      
      if (emailParam) {
        setEmail(emailParam);
        
        // If this is the admin email, verify the admin account
        if (await isDesignatedAdmin(emailParam)) {
          console.log('Admin email detected in URL params, verifying account');
          try {
            const { error } = await supabase.rpc('verify_designated_admin');
            if (error) {
              console.error('Error verifying admin from URL params:', error);
            } else {
              console.log('Admin verified successfully from URL params');
            }
          } catch (err) {
            console.error('Unexpected error verifying admin from URL:', err);
          }
        }
      }
    };

    checkParams();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const isAdmin = await isDesignatedAdmin(email);
      
      // For admin, ensure the account is verified before attempting login
      if (isAdmin) {
        console.log('Verifying admin account before login attempt');
        try {
          const { error } = await supabase.rpc('verify_designated_admin');
          if (error) {
            console.error('Error verifying admin before login:', error);
          } else {
            console.log('Admin verified successfully before login');
          }
        } catch (err) {
          console.error('Unexpected error verifying admin before login:', err);
        }
      }
      
      const success = await login(email, password);
      
      if (success) {
        if (isAdmin) {
          toast.success('Մուտքն հաջողվել է', {
            description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ որպես ադմինիստրատոր',
          });
        } else {
          toast.success('Մուտքն հաջողվել է', {
            description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ',
          });
        }
      } else {
        if (isAdmin) {
          setShowAdminReset(true);
          toast.error('Ադմինի մուտքը չի հաջողվել', {
            description: 'Փորձեք վերակայել ադմինի հաշիվը և կրկին գրանցվել',
          });
        } else {
          toast.error('Մուտքը չի հաջողվել', {
            description: 'Էլ․ հասցեն կամ գաղտնաբառը սխալ է կամ Ձեր հաշիվը դեռ ակտիվացված չէ',
          });
        }
      }
    } catch (error) {
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterUserData) => {
    setIsLoading(true);
    try {
      const isAdmin = await isDesignatedAdmin(userData.email);
      
      if (userData.role === 'employer' && !userData.organization) {
        toast.error('Սխալ', {
          description: 'Կազմակերպության անունը պարտադիր է գործատուի համար',
        });
        return;
      }

      const autoApprove = userData.role === 'student' || isAdmin;
      
      const formattedUserData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: isAdmin ? 'admin' : userData.role,
        registration_approved: autoApprove,
        ...(userData.role === 'employer' && { organization: userData.organization })
      };

      const success = await registerUser(formattedUserData);
      
      if (success) {
        setVerificationSent(true);
        if (isAdmin) {
          // For admin, ensure the account is verified
          try {
            const { error } = await supabase.rpc('verify_designated_admin');
            if (error) {
              console.error('Error verifying admin after registration:', error);
            } else {
              console.log('Admin account verified after registration');
              
              setTimeout(() => {
                toast.info('Կարող եք մուտք գործել համակարգ', {
                  description: 'Ձեր ադմինիստրատորի հաշիվը ակտիվ է։ Օգտագործեք մուտքի ձևը հիմա։'
                });
              }, 1500);
            }
          } catch (err) {
            console.error('Unexpected error verifying admin after registration:', err);
          }
        }
      }
    } catch (error) {
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <RedirectHandler
        isAuthenticated={isAuthenticated}
        user={user}
        isApproved={isApproved}
      />
      <LoginContainer
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoading}
        verificationSent={verificationSent}
        email={email}
        showAdminReset={showAdminReset}
      />
    </>
  );
};

export default Login;
