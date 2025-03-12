
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LoginFormProps {
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isLoading: externalLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }
    
    setIsLoggingIn(true);
    try {
      const success = await login(email, password);
      
      if (!success) {
        console.log('Login failed from form');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Լրացրեք էլ․ հասցեն');
      return;
    }
    
    setIsLoggingIn(true);
    try {
      // For admin account, handle separately
      if (email.trim().toLowerCase() === 'gitedu@bk.ru') {
        toast.info('Ադմինի համար օգտագործեք "Վերակայել ադմինի հաշիվը" կոճակը');
        setShowForgotPassword(false);
        return;
      }
      
      // For regular users
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error('Գաղտնաբառի վերականգնման սխալ', {
          description: error.message
        });
      } else {
        toast.success('Վերականգնման հղումը ուղարկվել է', {
          description: 'Ստուգեք Ձեր էլ․ փոստը գաղտնաբառը վերականգնելու համար'
        });
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (showForgotPassword) {
    return (
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Էլ․ հասցե</Label>
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoggingIn || externalLoading}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ուղարկում...
            </>
          ) : 'Ուղարկել վերականգնման հղումը'}
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
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Գաղտնաբառ</Label>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-sm"
            onClick={() => setShowForgotPassword(true)}
          >
            Մոռացե՞լ եք գաղտնաբառը
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoggingIn || externalLoading}
      >
        {isLoggingIn || externalLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Մուտք...
          </>
        ) : 'Մուտք գործել'}
      </Button>
    </form>
  );
};

export default LoginForm;
