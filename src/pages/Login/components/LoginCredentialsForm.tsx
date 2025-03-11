
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import ForgotPasswordForm from './ForgotPasswordForm';
import { isDesignatedAdmin } from '@/contexts/auth/utils/sessionHelpers';
import { supabase } from '@/integrations/supabase/client';

interface LoginCredentialsFormProps {
  onResetEmailSent: () => void;
  externalLoading: boolean;
}

const LoginCredentialsForm: React.FC<LoginCredentialsFormProps> = ({ 
  onResetEmailSent,
  externalLoading
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Check if entered email is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (email) {
        const admin = await isDesignatedAdmin(email);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Մուտքագրեք վավեր էլ․ հասցե');
      return;
    }

    if (!password || password.length < 6) {
      toast.error('Գաղտնաբառը պետք է պարունակի առնվազն 6 նիշ');
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      console.log('Attempting login for:', email, 'Is admin:', isAdmin);
      
      // Special handling for designated admin
      if (isAdmin) {
        try {
          // Call verify_designated_admin RPC directly to ensure admin account is verified
          const { error: rpcError } = await supabase.rpc('verify_designated_admin');
          if (rpcError) {
            console.error('Error verifying admin via RPC:', rpcError);
          } else {
            console.log('Admin verification via RPC successful');
          }
        } catch (err) {
          console.error('Error in admin verification process:', err);
        }
      }
      
      const success = await login(email, password);
      
      if (success) {
        console.log('Login successful, navigating to appropriate page based on role');
        toast.success('Մուտքն հաջողվել է');
        // We'll let App.tsx handle the navigation based on role
      } else {
        console.log('Login was not successful');
        // If admin login failed, suggest account reset
        if (isAdmin) {
          navigate('/?admin_reset=true#');
        }
        // Error messages are handled in authOperations.ts
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Էլ․ հասցե</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoggingIn || externalLoading}
        />
        {isAdmin && (
          <p className="text-sm text-blue-600 mt-1">
            Ադմինիստրատորի հաշիվ - ավտոմատ հաստատված
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Գաղտնաբառ</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoggingIn || externalLoading}
          minLength={6}
        />
      </div>
      
      <div className="flex items-center justify-end">
        <ForgotPasswordForm 
          email={email} 
          onReset={onResetEmailSent} 
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={externalLoading || isLoggingIn}
      >
        {externalLoading || isLoggingIn ? 'Մուտք...' : 'Մուտք գործել'}
      </Button>
    </form>
  );
};

export default LoginCredentialsForm;
