
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';

interface PasswordResetFormProps {
  email: string;
  onComplete: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ 
  email, 
  onComplete 
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const navigate = useNavigate();
  const { login, updatePassword } = useAuth();

  // For admin quick setup - can be triggered internally
  const handleAdminPasswordSetup = async () => {
    if (email === 'gitedu@bk.ru') {
      const adminPassword = 'Qolej2025*';
      setIsUpdatingPassword(true);
      
      try {
        console.log('Setting up admin password to', adminPassword);
        const success = await updatePassword(adminPassword);
        
        if (success) {
          console.log('Admin password set successfully');
          toast.success('Ադմին գաղտնաբառը հաջողությամբ սահմանվել է');
          
          // Auto-login with new password
          console.log('Attempting admin auto-login with email:', email, 'and password:', adminPassword);
          try {
            const loginSuccess = await login(email, adminPassword);
            
            if (loginSuccess) {
              console.log('Admin auto-login successful');
              toast.success('Մուտքն հաջողվել է');
              navigate('/admin');
              return; // Exit early
            } else {
              console.log('Admin auto-login failed');
              toast.error('Ադմինի գաղտնաբառը սահմանված է, սակայն ավտոմատ մուտքը չի հաջողվել');
            }
          } catch (loginErr) {
            console.error('Admin auto-login error:', loginErr);
            toast.error('Ավտոմատ մուտքի սխալ: Խնդրում ենք մուտք գործել ձեռքով');
          }
        } else {
          console.log('Admin password setup failed');
          toast.error('Ադմինի գաղտնաբառի սահմանումը չի հաջողվել');
        }
      } catch (err) {
        console.error('Admin password setup error:', err);
        toast.error('Տեղի ունեցավ անսպասելի սխալ');
      } finally {
        setIsUpdatingPassword(false);
        onComplete();
      }
    }
  };

  // This is used to auto-setup admin password when component loads if needed
  React.useEffect(() => {
    if (email === 'gitedu@bk.ru') {
      console.log('Admin email detected in password reset form, auto-setting password');
      handleAdminPasswordSetup();
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      console.log('Updating password...');
      const success = await updatePassword(newPassword);

      if (success) {
        console.log('Password updated successfully');
        toast.success('Գաղտնաբառը հաջողությամբ թարմացվել է');
        
        if (email) {
          console.log('Attempting auto-login with new password for email:', email);
          
          try {
            const loginSuccess = await login(email, newPassword);
            
            if (loginSuccess) {
              console.log('Auto-login successful');
              toast.success('Մուտքն հաջողվել է');
              navigate('/');
              return; // Exit early to prevent onComplete() from being called
            } else {
              console.log('Auto-login failed');
              toast.error('Գաղտնաբառը թարմացված է, բայց ավտոմատ մուտքը չի հաջողվել: Խնդրում ենք փորձել մուտք գործել ձեռքով');
            }
          } catch (loginErr) {
            console.error('Auto-login error:', loginErr);
            toast.error('Ավտոմատ մուտքի սխալ: Խնդրում ենք մուտք գործել ձեռքով');
          }
        } else {
          console.log('No email found for auto-login');
          toast.error('Չհաջողվեց պարզել օգտատիրոջ էլ․ հասցեն: Խնդրում ենք ձեռքով մուտք գործել');
        }
        
        onComplete();
      } else {
        console.log('Password update was not successful');
        toast.error('Գաղտնաբառի թարմացումը չի հաջողվել: Փորձեք կրկին');
      }
    } catch (err) {
      console.error('Password update error:', err);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
      onComplete();
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // If the admin password is being auto-set, just show loading state
  if (email === 'gitedu@bk.ru' && isUpdatingPassword) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p>Ադմինի գաղտնաբառը սահմանվում է...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-700 mb-4">
        <h3 className="font-medium mb-2">Գաղտնաբառի վերականգնում</h3>
        <p>Մուտքագրեք Ձեր նոր գաղտնաբառը</p>
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
          minLength={6}
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
          minLength={6}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isUpdatingPassword}>
        {isUpdatingPassword ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Թարմացվում է...
          </>
        ) : 'Պահպանել գաղտնաբառը'}
      </Button>
    </form>
  );
};

export default PasswordResetForm;
