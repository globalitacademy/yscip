
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginFormProps } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading: externalLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handlePasswordReset = async () => {
      const hash = location.hash;
      const type = new URLSearchParams(hash.substring(1)).get('type');
      
      if (type === 'recovery') {
        setIsResetting(true);
        toast.info('Մուտքագրեք Ձեր նոր գաղտնաբառը');
      }
    };

    handlePasswordReset();
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isResetting) {
      await handlePasswordUpdate();
    } else {
      setIsLoggingIn(true);
      try {
        const success = await login(email, password);
        
        if (success) {
          toast.success('Մուտքն հաջողվել է');
          navigate('/');
        } else {
          // Սխալի մասին արդեն ծանուցում է login ֆունկցիան
        }
      } catch (err) {
        console.error('Unexpected login error:', err);
        toast.error('Տեղի ունեցավ անսպասելի սխալ');
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Գաղտնաբառերը չեն համընկնում');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Գաղտնաբառը պետք է պարունակի առնվազն 6 նիշ');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error('Սխալ: ' + error.message);
      } else {
        toast.success('Գաղտնաբառը հաջողությամբ թարմացվել է');
        setIsResetting(false);
        
        // Փորձենք մուտք գործել նոր գաղտնաբառով
        const currentEmail = email || (await supabase.auth.getSession()).data.session?.user?.email || '';
        
        if (currentEmail) {
          const success = await login(currentEmail, newPassword);
          
          if (success) {
            toast.success('Մուտքն հաջողվել է');
            navigate('/');
          } else {
            toast.error('Գաղտնաբառը թարմացված է, բայց ավտոմատ մուտքը չի հաջողվել: Խնդրում ենք փորձել մուտք գործել ձեռքով');
            navigate('/login');
          }
        } else {
          toast.error('Չհաջողվեց պարզել օգտատիրոջ էլ․ հասցեն: Խնդրում ենք ձեռքով մուտք գործել');
          navigate('/login');
        }
      }
    } catch (err) {
      console.error('Password update error:', err);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
    } finally {
      setIsUpdatingPassword(false);
    }
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

  if (isResetting) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-700 mb-4">
          Մուտքագրեք Ձեր նոր գաղտնաբառը
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newPassword">Նոր գաղտնաբառ</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Հաստատեք գաղտնաբառը</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isUpdatingPassword}>
          {isUpdatingPassword ? 'Թարմացվում է...' : 'Պահպանել գաղտնաբառը'}
        </Button>
      </form>
    );
  }

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
          
          <Button type="submit" className="w-full" disabled={externalLoading || isLoggingIn}>
            {externalLoading || isLoggingIn ? 'Մուտք...' : 'Մուտք գործել'}
          </Button>
        </>
      )}
    </form>
  );
};

export default LoginForm;
