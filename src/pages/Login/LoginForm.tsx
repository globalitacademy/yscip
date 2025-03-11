
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
    const handlePasswordReset = async () => {
      const hash = location.hash;
      const type = new URLSearchParams(hash.substring(1)).get('type');
      const emailParam = new URLSearchParams(hash.substring(1)).get('email');
      
      if (type === 'recovery') {
        setIsResetting(true);
        toast.info('Մուտքագրեք Ձեր նոր գաղտնաբառը');
        
        if (emailParam) {
          console.log('Found email in URL:', emailParam);
          setEmail(emailParam);
        }
      }
    };

    handlePasswordReset();
  }, [location]);

  const handleResetComplete = () => {
    setIsResetting(false);
    setResetEmailSent(false);
  };

  const handleResetEmailSent = () => {
    setResetEmailSent(true);
  };

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
