
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLoginForm } from '@/hooks/useLoginForm';
import EmailInput from './login/EmailInput';
import PasswordInput from './login/PasswordInput';
import ForgotPasswordLink from './login/ForgotPasswordLink';
import { Loader2 } from 'lucide-react';

const LoginForm: React.FC = () => {
  const {
    email,
    password,
    isLoading,
    adminActivationInProgress,
    handleEmailChange,
    handlePasswordChange,
    handleLogin
  } = useLoginForm();

  const isAdminLogin = email.toLowerCase() === 'gitedu@bk.ru';
  const showAdminActivationLoader = isAdminLogin && adminActivationInProgress;
  
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
      
      {showAdminActivationLoader && (
        <div className="flex items-center justify-center space-x-2 text-amber-600 bg-amber-50 p-2 rounded-md text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Ադմինիստրատորի հաշիվը ակտիվացվում է...</span>
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isAdminLogin ? 'Ադմինիստրատորի մուտք...' : 'Մուտք...'}
          </span>
        ) : (
          'Մուտք գործել'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
