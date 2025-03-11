
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginFormProps } from './types';
import { toast } from 'sonner';
import LoginCredentialsForm from './components/LoginCredentialsForm';
import PasswordResetForm from './components/PasswordResetForm';
import ResetEmailSentAlert from './components/ResetEmailSentAlert';

const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  isLoading: externalLoading 
}) => {
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [email, setEmail] = useState('');
  const location = useLocation();

  useEffect(() => {
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
    <LoginCredentialsForm 
      onResetEmailSent={handleResetEmailSent}
      externalLoading={externalLoading}
    />
  );
};

export default LoginForm;
