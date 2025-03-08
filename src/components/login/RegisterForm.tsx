
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRole } from '@/data/userRoles';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  organization: string;
  setOrganization: (organization: string) => void;
  department: string;
  setDepartment: (department: string) => void;
  acceptTerms: boolean;
  setAcceptTerms: (acceptTerms: boolean) => void;
  handleRegister: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => boolean;
  validateConfirmPassword: (confirmPassword: string) => boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  role,
  setRole,
  organization,
  setOrganization,
  department,
  setDepartment,
  acceptTerms,
  setAcceptTerms,
  handleRegister,
  isLoading,
  emailError,
  passwordError,
  confirmPasswordError,
  validateEmail,
  validatePassword,
  validateConfirmPassword
}) => {
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
            <SelectItem value="project_manager">Նախագծի ղեկավար</SelectItem>
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
      
      {/* Show department field for lecturers and project managers */}
      {(role === 'lecturer' || role === 'project_manager') && (
        <div className="space-y-2">
          <Label htmlFor="department">Ֆակուլտետ</Label>
          <Input
            id="department"
            type="text"
            placeholder="Ֆակուլտետի անունը"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
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
