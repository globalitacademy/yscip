
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserRole } from '@/data/userRoles';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Info, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VerificationSentAlert from './VerificationSentAlert';

const RegisterForm: React.FC = () => {
  const { registerUser, sendVerificationEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [organization, setOrganization] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'Մուտքագրեք վավեր էլ․ հասցե');
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters and contain uppercase, lowercase and numbers
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isValid = passwordRegex.test(password);
    setPasswordError(isValid ? '' : 'Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ, մեծատառ, փոքրատառ և թվանշան');
    return isValid;
  };

  const validateConfirmPassword = (confirmPass: string): boolean => {
    const isValid = confirmPass === password;
    setConfirmPasswordError(isValid ? '' : 'Գաղտնաբառերը չեն համընկնում');
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate all fields
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

      // Check if employer has organization
      if (role === 'employer' && !organization) {
        toast.error('Սխալ', {
          description: 'Կազմակերպության անունը պարտադիր է գործատուի համար',
        });
        setIsLoading(false);
        return;
      }

      const userData = {
        name,
        email,
        role,
        password,
        registrationApproved: role === 'student', // Students are auto-approved
        ...(role === 'employer' && { organization })
      };

      const result = await registerUser(userData);
      
      if (result.success) {
        setVerificationSent(true);
        setResendEmail(email);
        setVerificationToken(result.token || '');
        
        // Clear the form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setOrganization('');
        setRole('student');
        setAcceptTerms(false);
      }
    } catch (error) {
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    
    const result = await sendVerificationEmail(resendEmail);
    if (result.success) {
      setVerificationToken(result.token || '');
      toast.success('Հաստատման հղումը կրկին ուղարկված է', {
        description: 'Խնդրում ենք ստուգել Ձեր էլ․ փոստը'
      });
    } else {
      toast.error('Սխալ', {
        description: 'Չհաջողվեց վերաուղարկել հաստատման հղումը'
      });
    }
  };

  // Role descriptions for registration form
  const getRoleDescription = (selectedRole: UserRole) => {
    switch (selectedRole) {
      case 'admin':
        return 'Կառավարել օգտատերերին, նախագծերը և համակարգը';
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
    return (
      <VerificationSentAlert 
        role={role}
        verificationToken={verificationToken}
        handleResendVerification={handleResendVerification}
      />
    );
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
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
          onChange={(e) => {
            setEmail(e.target.value);
            if (e.target.value) validateEmail(e.target.value);
          }}
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
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value) validatePassword(e.target.value);
            if (confirmPassword) validateConfirmPassword(confirmPassword);
          }}
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
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (e.target.value) validateConfirmPassword(e.target.value);
          }}
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
            <SelectItem value="supervisor">Ղեկավար</SelectItem>
            <SelectItem value="employer">Գործատու</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          {getRoleDescription(role)}
        </p>
        
        {/* Show warning for roles that need approval */}
        {role !== 'student' && (
          <p className="text-sm text-amber-600 mt-2">
            Նշում: {role === 'employer' ? 'Գործատուի' : role === 'lecturer' ? 'Դասախոսի' : 'Ղեկավարի'} հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից:
          </p>
        )}
      </div>
      
      {/* Show organization field only for employers */}
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
