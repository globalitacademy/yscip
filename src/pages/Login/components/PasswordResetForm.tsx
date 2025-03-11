
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

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
        toast.success('Գաղտնաբառը հաջողությամբ թարմացվել է');
        
        if (email) {
          console.log('Attempting auto-login with new password...');
          const loginSuccess = await login(email, newPassword);
          
          if (loginSuccess) {
            toast.success('Մուտքն հաջողվել է');
            navigate('/');
          } else {
            toast.error('Գաղտնաբառը թարմացված է, բայց ավտոմատ մուտքը չի հաջողվել: Խնդրում ենք փորձել մուտք գործել ձեռքով');
            onComplete();
          }
        } else {
          toast.error('Չհաջողվեց պարզել օգտատիրոջ էլ․ հասցեն: Խնդրում ենք ձեռքով մուտք գործել');
          onComplete();
        }
      }
    } catch (err) {
      console.error('Password update error:', err);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
      onComplete();
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
};

export default PasswordResetForm;
