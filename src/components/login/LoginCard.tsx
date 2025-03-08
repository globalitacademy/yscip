
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { UserRole } from '@/data/userRoles';

interface LoginCardProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  name: string;
  setName: (name: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  organization: string;
  setOrganization: (organization: string) => void;
  department: string;
  setDepartment: (department: string) => void;
  acceptTerms: boolean;
  setAcceptTerms: (acceptTerms: boolean) => void;
  isLoading: boolean;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleRegister: (e: React.FormEvent) => Promise<void>;
  handleSuperAdminLogin: () => void;
  handleMagicLinkLogin: () => Promise<void>;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => boolean;
  validateConfirmPassword: (confirmPassword: string) => boolean;
}

const LoginCard: React.FC<LoginCardProps> = ({
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
  acceptTerms,
  setAcceptTerms,
  isLoading,
  handleLogin,
  handleRegister,
  handleSuperAdminLogin,
  handleMagicLinkLogin,
  emailError,
  passwordError,
  confirmPasswordError,
  validateEmail,
  validatePassword,
  validateConfirmPassword
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Մուտք / Գրանցում</CardTitle>
        <CardDescription>
          Մուտք գործեք համակարգ կամ ստեղծեք նոր հաշիվ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login" id="login-tab">Մուտք</TabsTrigger>
            <TabsTrigger value="register" id="register-tab">Գրանցում</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
              handleMagicLinkLogin={handleMagicLinkLogin}
              isLoading={isLoading}
              handleSuperAdminLogin={handleSuperAdminLogin}
            />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              role={role}
              setRole={setRole}
              organization={organization}
              setOrganization={setOrganization}
              department={department}
              setDepartment={setDepartment}
              acceptTerms={acceptTerms}
              setAcceptTerms={setAcceptTerms}
              handleRegister={handleRegister}
              isLoading={isLoading}
              emailError={emailError}
              passwordError={passwordError}
              confirmPasswordError={confirmPasswordError}
              validateEmail={validateEmail}
              validatePassword={validatePassword}
              validateConfirmPassword={validateConfirmPassword}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          &copy; 2023 NPUA Projects. Բոլոր իրավունքները պաշտպանված են։
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
