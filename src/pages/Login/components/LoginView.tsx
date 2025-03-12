
import React from 'react';
import { RedirectHandler } from './RedirectHandler';
import { LoginContainer } from './LoginContainer';
import { DBUser } from '@/types/database.types';
import { RegisterUserData } from '../types';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (userData: RegisterUserData) => Promise<void>;
  isLoading: boolean;
  verificationSent: boolean;
  email: string | null;
  showAdminReset: boolean;
  registeredRole: string | null;
  isAuthenticated: boolean;
  user: DBUser | null;
  isApproved: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onRegister,
  isLoading,
  verificationSent,
  email,
  showAdminReset,
  registeredRole,
  isAuthenticated,
  user,
  isApproved
}) => {
  return (
    <>
      <RedirectHandler
        isAuthenticated={isAuthenticated}
        user={user}
        isApproved={isApproved}
      />
      <LoginContainer
        onLogin={onLogin}
        onRegister={onRegister}
        isLoading={isLoading}
        verificationSent={verificationSent}
        email={email}
        showAdminReset={showAdminReset}
        registeredRole={registeredRole}
      />
    </>
  );
};
