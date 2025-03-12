
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/data/userRoles';
import RoleSelector from './RoleSelector';
import { validateEmail, validatePassword, validateConfirmPassword } from '@/utils/validation';

interface RegistrationFormProps {
  onSuccess: (email: string, token: string) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const { registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'student' as UserRole,
    organization: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({
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

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Անուն Ազգանուն</Label>
        <Input
          id="name"
          type="text"
          placeholder="Անուն Ազգանուն"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-email">Էլ․ հասցե</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-password">Գաղտնաբառ</Label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Հաստատել գաղտնաբառը</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
      </div>
      
      <RoleSelector role={formData.role} onRoleChange={(role) => handleInputChange('role', role)} />
        
      {formData.role === 'employer' && (
        <div className="space-y-2">
          <Label htmlFor="organization">Կազմակերպության անունը</Label>
          <Input
            id="organization"
            type="text"
            placeholder="Կազմակերպության անունը"
            value={formData.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            required
          />
        </div>
      )}
      
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="terms" 
          checked={formData.acceptTerms}
          onCheckedChange={(checked) => {
            if (typeof checked === 'boolean') {
              handleInputChange('acceptTerms', checked);
            }
          }} 
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Համաձայն եմ համակարգի{" "}
          <Button variant="link" className="p-0 h-auto text-xs" type="button">
            կանոններին
          </Button>
        </label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Գրանցում...' : 'Գրանցվել'}
      </Button>
    </form>
  );
};

export default RegistrationForm;
