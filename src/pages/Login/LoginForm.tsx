
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginFormProps } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Մուտքագրեք էլ․ հասցեն');
      return;
    }

    setIsSendingReset(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login',
      });
      
      if (error) {
        toast.error('Սխալ: ' + error.message);
      } else {
        setResetEmailSent(true);
        toast.success('Գաղտնաբառը վերականգնելու հղումը ուղարկվել է Ձեր էլ․ փոստին։');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {resetEmailSent ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-700">
          Գաղտնաբառը վերականգնելու հղումը ուղարկվել է Ձեր էլ․ փոստին։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը և հետևել հղմանը։
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Էլ․ հասցե</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
            />
          </div>
          
          <div className="flex items-center justify-end">
            <Button 
              variant="link" 
              type="button" 
              className="p-0 h-auto text-sm"
              onClick={handleResetPassword}
              disabled={isSendingReset}
            >
              {isSendingReset ? 'Ուղարկվում է...' : 'Մոռացել եք գաղտնաբառը?'}
            </Button>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Մուտք...' : 'Մուտք գործել'}
          </Button>
        </>
      )}
    </form>
  );
};

export default LoginForm;
