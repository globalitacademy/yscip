
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UserRole } from '@/data/userRoles';
import { supabase } from '@/integrations/supabase/client';

export const useLoginPage = () => {
  const { login, registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'Մուտքագրեք վավեր էլ․ հասցե');
    return isValid;
  };

  // Password validation
  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isValid = passwordRegex.test(password);
    setPasswordError(isValid ? '' : 'Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ, մեծատառ, փոքրատառ և թվանշան');
    return isValid;
  };

  // Confirm password validation
  const validateConfirmPassword = (confirmPass: string): boolean => {
    const isValid = confirmPass === password;
    setConfirmPasswordError(isValid ? '' : 'Գաղտնաբառերը չեն համընկնում');
    return isValid;
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Մուտքն հաջողվել է', {
          description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ',
        });
        navigate('/');
      }
    } catch (error) {
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Super admin login
  const handleSuperAdminLogin = async () => {
    setEmail('gitedu@bk.ru');
    setPassword('Gev2025*');
    
    toast.info('Սուպերադմին տվյալները լրացված են: Սեղմեք "Մուտք գործել" կոճակը մուտք գործելու համար:');
    toast.info('Եթե առաջին անգամ եք մուտք գործում, ապա պետք է ստեղծել հաշիվ "Գրանցում" էջում:');
  };

  // Magic link login
  const handleMagicLinkLogin = async () => {
    if (!email) {
      toast.error('Մուտքագրեք Ձեր էլ. հասցեն Magic Link ստանալու համար');
      return;
    }
    
    if (!validateEmail(email)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) {
        console.error('Magic link error:', error);
        toast.error('Չհաջողվեց ուղարկել մուտքի հղումը: ' + error.message);
      } else {
        toast.success('Մուտքի հղումն ուղարկվել է Ձեր էլ․ հասցեին: Խնդրում ենք ստուգել Ձեր փոստարկղը:');
      }
    } catch (error: any) {
      toast.error('Սխալ', {
        description: error.message || 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Registration handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isEmailValid = validateEmail(email);
      const isPasswordValid = validatePassword(password);
      const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
      
      if (!name || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !acceptTerms) {
        if (!name) {
          toast.error('Սխալ', {
            description: 'Անուն Ազգանունը պարտադիր է',
          });
        }
        
        if (!acceptTerms) {
          toast.error('Սխալ', {
            description: 'Պետք է համաձայնեք գաղտնիության քաղաքականությանը',
          });
        }
        
        setIsLoading(false);
        return;
      }

      if (role === 'employer' && !organization) {
        toast.error('Սխալ', {
          description: 'Կազմակերպության անունը պարտադիր է գործատուի համար',
        });
        setIsLoading(false);
        return;
      }

      if ((role === 'lecturer' || role === 'project_manager') && !department) {
        toast.error('Սխալ', {
          description: 'Ֆակուլտետի անունը պարտադիր է',
        });
        setIsLoading(false);
        return;
      }

      const userData = {
        name,
        email,
        role,
        password,
        ...(role === 'employer' && { organization }),
        ...(role === 'lecturer' || role === 'project_manager' ? { department } : {})
      };

      const result = await registerUser(userData);
      
      if (result.success) {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setOrganization('');
        setDepartment('');
        setRole('student');
        setAcceptTerms(false);
        
        document.getElementById('login-tab')?.click();
      } else if (result.message) {
        toast.error('Գրանցման սխալ', {
          description: result.message
        });
      }
    } catch (error: any) {
      toast.error('Սխալ', {
        description: error.message || 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    role,
    setRole,
    organization,
    setOrganization,
    department,
    setDepartment,
    isLoading,
    acceptTerms,
    setAcceptTerms,
    emailError,
    passwordError,
    confirmPasswordError,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    handleLogin,
    handleSuperAdminLogin,
    handleMagicLinkLogin,
    handleRegister
  };
};
