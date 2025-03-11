
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateEmail } from '../validation';
import { sendVerificationEmail } from '@/contexts/auth/operations';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface LoginCredentialsFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onResetEmailSent: () => void;
  externalLoading?: boolean;
  defaultEmail?: string;
}

const LoginCredentialsForm: React.FC<LoginCredentialsFormProps> = ({ 
  onLogin, 
  onResetEmailSent,
  externalLoading,
  defaultEmail = ''
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errorMessage } = validateEmail(forgotEmail || email);
    if (!isValid) {
      setEmailError(errorMessage);
      return;
    }
    
    setIsLoading(true);
    try {
      const emailToUse = forgotEmail || email;
      
      const { error } = await supabase.auth.resetPasswordForEmail(emailToUse, {
        redirectTo: `${window.location.origin}/login`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        toast.error('Սխալ', {
          description: error.message
        });
      } else {
        onResetEmailSent();
        toast.success('Հղումն ուղարկված է', {
          description: 'Գաղտնաբառը վերականգնելու հղումը ուղարկվել է Ձեր էլ․ փոստին'
        });
      }
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    
    const { isValid, errorMessage } = validateEmail(email);
    if (!isValid) {
      setEmailError(errorMessage);
      return;
    }
    
    setIsLoading(true);
    try {
      await sendVerificationEmail(email);
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return showForgotPassword ? (
    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="forgot-email">Էլ․ հասցե</Label>
        <Input
          id="forgot-email"
          placeholder="name@example.com"
          type="email"
          value={forgotEmail || email}
          onChange={(e) => setForgotEmail(e.target.value)}
          className={emailError ? "border-red-500" : ""}
          required
        />
        {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Հղման ուղարկում...' : 'Ուղարկել վերականգնման հղումը'}
      </Button>
      
      <Button 
        type="button" 
        variant="ghost" 
        className="w-full"
        onClick={() => setShowForgotPassword(false)}
      >
        Վերադառնալ մուտքի էջ
      </Button>
    </form>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Էլ․ հասցե</Label>
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Գաղտնաբառ</Label>
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm"
            onClick={() => setShowForgotPassword(true)}
            type="button"
          >
            Մոռացե՞լ եք գաղտնաբառը
          </Button>
        </div>
        <Input
          id="password"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={externalLoading || isLoading}>
        {externalLoading ? 'Մուտք գործել...' : 'Մուտք գործել'}
      </Button>
      
      <div className="text-center mt-4">
        <Button 
          variant="link" 
          className="p-0 h-auto text-sm text-muted-foreground"
          onClick={handleResendVerification}
          type="button"
          disabled={isLoading}
        >
          Չե՞ք ստացել հաստատման հղումը: Ուղարկել կրկին
        </Button>
      </div>
    </form>
  );
};

export default LoginCredentialsForm;
