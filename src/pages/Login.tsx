
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginCard from '@/components/login/LoginCard';
import { useLoginPage } from '@/hooks/useLoginPage';
import { useMagicLinkAuth } from '@/hooks/useMagicLinkAuth';
import { useSuperAdminInit } from '@/hooks/useSuperAdminInit';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const loginPageHook = useLoginPage();
  
  // Use custom hooks
  useMagicLinkAuth(loginPageHook.setIsLoading);
  useSuperAdminInit();

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <LoginCard
          {...loginPageHook}
        />
      </div>
    </div>
  );
};

export default Login;
