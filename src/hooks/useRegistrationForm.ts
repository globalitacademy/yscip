
import { useState } from 'react';
import { validateEmail, validatePassword, validateConfirmPassword } from '@/utils/validation';
import { toast } from 'sonner';
import { UserRole } from '@/data/userRoles';
import { useAuth } from '@/contexts/AuthContext';

export interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: UserRole;
  organization: string;
  acceptTerms: boolean;
}

export interface RegistrationFormErrors {
  email: string;
  password: string;
  confirmPassword: string;
}

export const useRegistrationForm = (onSuccess: (email: string, token: string) => void) => {
  const { registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'student',
    organization: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState<RegistrationFormErrors>({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'email') {
      const { error } = validateEmail(value as string);
      setErrors(prev => ({ ...prev, email: error }));
    }
    
    if (field === 'password') {
      const { error } = validatePassword(value as string);
      setErrors(prev => ({ ...prev, password: error }));
      
      if (formData.confirmPassword) {
        const { error: confirmError } = validateConfirmPassword(value as string, formData.confirmPassword);
        setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
      }
    }
    
    if (field === 'confirmPassword') {
      const { error } = validateConfirmPassword(formData.password, value as string);
      setErrors(prev => ({ ...prev, confirmPassword: error }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const emailValidation = validateEmail(formData.email);
      const passwordValidation = validatePassword(formData.password);
      const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
      
      if (!formData.name || !emailValidation.isValid || !passwordValidation.isValid || 
          !confirmPasswordValidation.isValid || !formData.acceptTerms) {
        if (!formData.name) {
          toast.error('Սխալ', {
            description: 'Անուն Ազգանունը պարտադիր է',
          });
        }
        
        if (!formData.acceptTerms) {
          toast.error('Սխալ', {
            description: 'Պետք է համաձայնեք գաղտնիության քաղաքականությանը',
          });
        }
        
        setIsLoading(false);
        return;
      }

      if (formData.role === 'employer' && !formData.organization) {
        toast.error('Սխալ', {
          description: 'Կազմակերպության անունը պարտադիր է գործատուի համար',
        });
        setIsLoading(false);
        return;
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
        registrationApproved: formData.role === 'student',
        ...(formData.role === 'employer' && { organization: formData.organization })
      };

      const result = await registerUser(userData);
      
      if (result.success) {
        onSuccess(formData.email, result.token || '');
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
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleRegister
  };
};
