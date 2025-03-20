
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLoginForm } from '@/hooks/useLoginForm';
import EmailInput from './login/EmailInput';
import PasswordInput from './login/PasswordInput';
import ForgotPasswordLink from './login/ForgotPasswordLink';

const LoginForm: React.FC = () => {
  const {
    email,
    password,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleLogin
  } = useLoginForm();

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <EmailInput 
        value={email}
        onChange={handleEmailChange}
      />
      
      <PasswordInput 
        value={password}
        onChange={handlePasswordChange}
      />
      
      <ForgotPasswordLink />
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Մուտք...' : 'Մուտք գործել'}
      </Button>
    </form>
  );
};

export default LoginForm;
