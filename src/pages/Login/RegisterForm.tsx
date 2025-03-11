import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRole } from '@/types/database.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegisterFormProps, RegisterUserData } from './types';
import { validateEmail, validatePassword, validateConfirmPassword } from './validation';
import VerificationSentAlert from './VerificationSentAlert';

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onRegister, 
  isLoading, 
  verificationSent 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [organization, setOrganization] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    if (email) {
      const { errorMessage } = validateEmail(email);
      setEmailError(errorMessage);
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      const { errorMessage } = validatePassword(password);
      setPasswordError(errorMessage);
    }
    
    if (confirmPassword) {
      const { errorMessage } = validateConfirmPassword(confirmPassword, password);
      setConfirmPasswordError(errorMessage);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email).isValid;
    const isPasswordValid = validatePassword(password).isValid;
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password).isValid;
    
    if (!name || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !acceptTerms) {
      return;
    }

    const userData: RegisterUserData = {
      name,
      email,
      password,
      role,
      ...(role === 'employer' && { organization })
    };

    await onRegister(userData);
  };

  const getRoleDescription = (selectedRole: UserRole) => {
    switch (selectedRole) {
      case 'admin':
        return 'Կառավարել օգտատերերին, նախագծերը և համակարգը (Առաջին ադմինը ստանում է լիարժեք մուտք)';
      case 'lecturer':
        return 'Ստեղծել առաջադրանքներ, գնահատել ուսանողներին';
      case 'project_manager':
        return 'Կառավարել նախագծերը, հետևել առաջընթացին';
      case 'employer':
        return 'Հայտարարել նոր նախագծեր, համագործակցել ուսանողների հետ';
      case 'student':
        return 'Ընտրել և կատարել նախագծեր, զարգացնել հմտություններ';
      default:
        return '';
    }
  };

  if (verificationSent) {
    return <VerificationSentAlert role={role} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Անուն Ազգանուն</Label>
        <Input
          id="name"
          type="text"
          placeholder="Անուն Ազգանուն"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-email">Էլ․ հասցե</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={emailError ? "border-red-500" : ""}
        />
        {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-password">Գաղտնաբառ</Label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={passwordError ? "border-red-500" : ""}
        />
        {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Հաստատել գաղտնաբառը</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={confirmPasswordError ? "border-red-500" : ""}
        />
        {confirmPasswordError && <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Դերակատարում</Label>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as UserRole)}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Ընտրեք դերը" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Ուսանող</SelectItem>
            <SelectItem value="lecturer">Դասախոս</SelectItem>
            <SelectItem value="project_manager">Նախագծի ղեկավար</SelectItem>
            <SelectItem value="employer">Գործատու</SelectItem>
            <SelectItem value="admin">Ադմինիստրատոր</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          {getRoleDescription(role)}
        </p>
        
        {role !== 'student' && (
          <p className="text-sm text-amber-600 mt-2">
            Նշում: {role === 'employer' ? 'Գործատուի' : role === 'lecturer' ? 'Դասախոսի' : role === 'admin' ? 'Ադմինիստրատորի' : 'Ղեկավարի'} հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից:
          </p>
        )}
      </div>
      
      {role === 'employer' && (
        <div className="space-y-2">
          <Label htmlFor="organization">Կազմակերպություն</Label>
          <Input
            id="organization"
            type="text"
            placeholder="Կազմակերպության անունը"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
        </div>
      )}
      
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="terms" 
          checked={acceptTerms} 
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm">
          Ես համաձայն եմ <Button variant="link" className="p-0 h-auto text-sm">գաղտնիության քաղաքականության</Button> պայմաններին
        </Label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Գրանցում...' : 'Գրանցվել'}
      </Button>
    </form>
  );
};

export default RegisterForm;
