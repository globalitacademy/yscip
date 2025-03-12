
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import RoleSelector from './RoleSelector';
import NameInput from './registration/NameInput';
import EmailInput from './registration/EmailInput';
import PasswordInputs from './registration/PasswordInputs';
import OrganizationInput from './registration/OrganizationInput';
import TermsCheckbox from './registration/TermsCheckbox';

interface RegistrationFormProps {
  onSuccess: (email: string, token: string) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleRegister
  } = useRegistrationForm(onSuccess);

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <NameInput 
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
      />
      
      <EmailInput 
        value={formData.email}
        error={errors.email}
        onChange={(value) => handleInputChange('email', value)}
      />
      
      <PasswordInputs 
        password={formData.password}
        confirmPassword={formData.confirmPassword}
        passwordError={errors.password}
        confirmPasswordError={errors.confirmPassword}
        onPasswordChange={(value) => handleInputChange('password', value)}
        onConfirmPasswordChange={(value) => handleInputChange('confirmPassword', value)}
      />
      
      <RoleSelector 
        role={formData.role} 
        onRoleChange={(role) => handleInputChange('role', role)} 
      />
        
      <OrganizationInput 
        value={formData.organization}
        onChange={(value) => handleInputChange('organization', value)}
        required={formData.role === 'employer'}
      />
      
      <TermsCheckbox 
        checked={formData.acceptTerms}
        onChange={(checked) => handleInputChange('acceptTerms', checked)}
      />
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Գրանցում...' : 'Գրանցվել'}
      </Button>
    </form>
  );
};

export default RegistrationForm;
