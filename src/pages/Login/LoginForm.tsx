
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginFormProps } from './types';
import { toast } from 'sonner';
import LoginCredentialsForm from './components/LoginCredentialsForm';
import PasswordResetForm from './components/PasswordResetForm';
import ResetEmailSentAlert from './components/ResetEmailSentAlert';
import { supabase } from '@/integrations/supabase/client';
import { isDesignatedAdmin, checkFirstAdmin } from '@/contexts/auth/utils';

const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  isLoading: externalLoading 
}) => {
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check for special admin params
    const checkSpecialParams = async () => {
      const hash = location.hash;
      if (!hash) return;

      const params = new URLSearchParams(hash.substring(1));
      const emailParam = params.get('email');
      
      if (emailParam) {
        setEmail(emailParam);
        
        // Check if admin or first admin
        try {
          const { data: adminResult, error: adminError } = await supabase.rpc(
            'is_designated_admin',
            { email_to_check: emailParam }
          );
          
          if (adminError) {
            console.error('Error checking if designated admin:', adminError);
          } else {
            setIsAdmin(!!adminResult);
            
            if (!adminResult) {
              const { data: firstAdminResult, error: firstAdminError } = await supabase.rpc('get_first_admin_status');
              
              if (firstAdminError) {
                console.error('Error checking if first admin:', firstAdminError);
              } else {
                setIsFirstAdmin(!!firstAdminResult);
                
                if (firstAdminResult) {
                  console.log('First admin detected in URL params:', emailParam);
                  toast.info('Առաջին ադմինիստրատորի հաշիվ', {
                    description: 'Հաստատվելու դեպքում Ձեզ կտրվեն լիարժեք իրավունքներ'
                  });
                }
              }
            }
          }
          
          if (adminResult) {
            console.log('Admin email detected in URL params');
            // Ensure admin is verified
            try {
              const { error } = await supabase.rpc('ensure_admin_login');
              if (error) {
                console.error('Error verifying admin from URL params:', error);
              } else {
                console.log('Admin verified successfully from URL params');
              }
            } catch (err) {
              console.error('Error in admin verification from URL:', err);
            }
          }
        } catch (err) {
          console.error('Error checking user type from URL params:', err);
        }
      }
    };
    
    checkSpecialParams();

    // Handle password reset from URL
    const handlePasswordReset = async () => {
      try {
        const hash = location.hash;
        if (!hash) return;

        console.log('Processing URL hash:', hash);
        const params = new URLSearchParams(hash.substring(1));
        const type = params.get('type');
        const emailParam = params.get('email');
        
        if (type === 'recovery') {
          console.log('Recovery flow detected');
          setIsResetting(true);
          toast.info('Մուտքագրեք Ձեր նոր գաղտնաբառը');
          
          if (emailParam) {
            console.log('Found email in URL:', emailParam);
            setEmail(emailParam);
          } else {
            console.log('No email found in recovery URL');
          }
        }
      } catch (error) {
        console.error('Error processing URL hash:', error);
      }
    };

    handlePasswordReset();
  }, [location]);

  const handleResetComplete = () => {
    console.log('Password reset completed');
    setIsResetting(false);
    setResetEmailSent(false);
  };

  const handleResetEmailSent = () => {
    console.log('Password reset email sent notification shown');
    setResetEmailSent(true);
  };

  // Decide which form to render
  if (isResetting) {
    return (
      <PasswordResetForm 
        email={email} 
        onComplete={handleResetComplete} 
      />
    );
  }

  if (resetEmailSent) {
    return <ResetEmailSentAlert />;
  }

  return (
    <>
      {isFirstAdmin && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
          <p className="font-medium">Առաջին ադմինիստրատորի հաշիվ</p>
          <p className="text-sm mt-1">Գրանցվելուց հետո Ձեզ կտրվեն ադմինիստրատորի լիարժեք իրավունքներ:</p>
        </div>
      )}
      
      {isAdmin && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
          <p className="font-medium">Ադմինիստրատորի հաշիվ</p>
          <p className="text-sm mt-1">Ձեր հաշիվը ամբողջությամբ հաստատված է։ Մուտք գործեք համակարգ:</p>
        </div>
      )}
      
      <LoginCredentialsForm 
        onLogin={onLogin}
        onResetEmailSent={handleResetEmailSent}
        externalLoading={externalLoading}
        defaultEmail={email}
      />
    </>
  );
};

export default LoginForm;
