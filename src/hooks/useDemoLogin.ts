
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserRole } from '@/data/userRoles';

export const useDemoLogin = () => {
  const [demoEmail, setDemoEmail] = useState('');
  const [demoPassword, setDemoPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performDemoLogin = async () => {
      if (demoEmail && demoPassword && !isLoggingIn) {
        setIsLoggingIn(true);
        try {
          const success = await login(demoEmail, demoPassword);
          if (success) {
            toast.success('Մուտքն հաջողվել է', {
              description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ',
            });
            navigate('/');
          } else {
            toast.error('Մուտքը չի հաջողվել', {
              description: 'Դեմո հաշվի մուտքի տվյալները սխալ են',
            });
          }
        } catch (error) {
          toast.error('Սխալ', {
            description: 'Տեղի ունեցավ անսպասելի սխալ',
          });
        } finally {
          setIsLoggingIn(false);
          // Clear demo login state
          setDemoEmail('');
          setDemoPassword('');
        }
      }
    };

    performDemoLogin();
  }, [demoEmail, demoPassword, login, navigate]);

  const handleQuickLogin = (role: UserRole) => {
    const email = `${role}@example.com`;
    setDemoEmail(email);
    setDemoPassword('password');
  };

  return {
    isLoggingIn,
    handleQuickLogin
  };
};
