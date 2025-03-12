
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserRole = 'admin' | 'lecturer' | 'instructor' | 'project_manager' | 'supervisor' | 'employer' | 'student';

interface RegisterFormProps {
  isLoading?: boolean;
  onRegisterSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  isLoading: externalLoading,
  onRegisterSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [organization, setOrganization] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { register } = useAuth();
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      toast.error('Լրացրեք Ձեր անունը');
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error('Անվավեր էլ․ հասցե');
      return;
    }
    
    if (!validatePassword(password)) {
      toast.error('Գաղտնաբառը պետք է ունենա առնվազն 6 նիշ');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Գաղտնաբառերը չեն համընկնում');
      return;
    }
    
    if (role === 'employer' && !organization.trim()) {
      toast.error('Կազմակերպության անունը պարտադիր է գործատուի համար');
      return;
    }
    
    if (!acceptTerms) {
      toast.error('Խնդրում ենք ընդունել կայքի օգտագործման պայմանները');
      return;
    }
    
    setIsRegistering(true);
    try {
      const success = await register(email, password, name, role, organization);
      
      if (success && onRegisterSuccess) {
        onRegisterSuccess();
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const getRoleDescription = (selectedRole: UserRole): string => {
    switch (selectedRole) {
      case 'admin':
        return 'Կառավարել օգտատերերին, նախագծերը և համակարգը';
      case 'lecturer':
        return 'Ստեղծել առաջադրանքներ, գնահատել ուսանողներին';
      case 'instructor':
        return 'Ուսուցանել, գնահատել ուսանողներին';
      case 'project_manager':
        return 'Կառավարել նախագծերը, հետևել առաջընթացին';
      case 'supervisor':
        return 'Վերահսկել նախագծերը և թիմերը';
      case 'employer':
        return 'Հայտարարել նոր նախագծեր, համագործակցել ուսանողների հետ';
      case 'student':
        return 'Ընտրել և կատարել նախագծեր, զարգացնել հմտություններ';
      default:
        return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Անուն Ազգանուն</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Անուն Ազգանուն"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Էլ․ հասցե</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Գաղտնաբառ</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <p className="text-xs text-muted-foreground">
          Գաղտնաբառը պետք է ունենա առնվազն 6 նիշ
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Հաստատել գաղտնաբառը</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
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
            <SelectItem value="instructor">Ուսուցիչ</SelectItem>
            <SelectItem value="project_manager">Նախագծի ղեկավար</SelectItem>
            <SelectItem value="supervisor">Վերահսկիչ</SelectItem>
            <SelectItem value="employer">Գործատու</SelectItem>
            <SelectItem value="admin">Ադմինիստրատոր</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {getRoleDescription(role)}
        </p>
      </div>
      
      {role === 'employer' && (
        <div className="space-y-2">
          <Label htmlFor="organization">Կազմակերպություն</Label>
          <Input
            id="organization"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Կազմակերպության անունը"
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
        <Label htmlFor="terms" className="text-sm font-normal">
          Ես համաձայն եմ կայքի օգտագործման պայմաններին
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isRegistering || externalLoading}
      >
        {isRegistering || externalLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Գրանցում...
          </>
        ) : 'Գրանցվել'}
      </Button>
    </form>
  );
};

export default RegisterForm;
