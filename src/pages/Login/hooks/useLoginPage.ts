
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { RegisterUserData } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useLoginPage = () => {
  const { login, registerUser, user, isAuthenticated, isApproved } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showAdminReset, setShowAdminReset] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [registeredRole, setRegisteredRole] = useState<string | null>(null);

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
        const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
          'is_designated_admin',
          { email_to_check: emailParam }
        );
        
        if (adminCheckError) {
          console.error('Error checking if designated admin:', adminCheckError);
        } else if (isAdmin) {
          console.log('Admin email detected in URL params, verifying account');
          try {
            const { error } = await supabase.rpc('ensure_admin_login');
            if (error) {
              console.error('Error verifying admin from URL params:', error);
            } else {
              console.log('Admin verified successfully from URL params');
              
              // If this is a password recovery, we don't want to auto-login
              if (params.get('type') !== 'recovery') {
                // Try to auto-login
                try {
                  const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: emailParam,
                    password: 'Qolej2025*'
                  });
                  
                  if (signInError) {
                    console.log('Admin auto-login attempt failed:', signInError.message);
                  } else {
                    console.log('Admin auto-login successful');
                    setTimeout(() => {
                      window.location.href = '/admin';
                    }, 1000);
                  }
                } catch (autoLoginErr) {
                  console.error('Error in admin auto-login attempt:', autoLoginErr);
                }
              }
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
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
        'is_designated_admin',
        { email_to_check: email }
      );
      
      if (adminCheckError) {
        console.error('Error checking if designated admin:', adminCheckError);
      }
      
      // For admin, ensure the account is verified before attempting login
      if (isAdmin) {
        console.log('Verifying admin account before login attempt');
        try {
          const { error } = await supabase.rpc('ensure_admin_login');
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
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
        'is_designated_admin',
        { email_to_check: userData.email }
      );
      
      if (adminCheckError) {
        console.error('Error checking if designated admin:', adminCheckError);
      }
      
      if (userData.role === 'employer' && !userData.organization) {
        toast.error('Սխալ', {
          description: 'Կազմակերպության անունը պարտադիր է գործատուի համար',
        });
        setIsLoading(false);
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

      setRegisteredRole(userData.role);
      const success = await registerUser(formattedUserData);
      
      if (success) {
        setVerificationSent(true);
        if (isAdmin) {
          // For admin, ensure the account is verified
          try {
            const { error } = await supabase.rpc('ensure_admin_login');
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

  return {
    handleLogin,
    handleRegister,
    isLoading,
    verificationSent,
    email,
    showAdminReset,
    registeredRole,
    user,
    isAuthenticated,
    isApproved
  };
};
