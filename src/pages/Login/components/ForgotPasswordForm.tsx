
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

interface ForgotPasswordFormProps {
  email: string;
  onReset: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  email, 
  onReset 
}) => {
  const [isSendingReset, setIsSendingReset] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Մուտքագրեք վավեր էլ․ հասցե');
      return;
    }

    setIsSendingReset(true);
    
    try {
      console.log('Requesting password reset for email:', email);
      const success = await resetPassword(email);
      
      if (success) {
        console.log('Password reset email sent successfully');
        onReset();
        toast.success('Վերականգնման հղումը ուղարկված է');
      } else {
        console.log('Password reset request was not successful');
        toast.error('Հղումը չի ուղարկվել: Փորձեք կրկին');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <Button 
      variant="link" 
      type="button" 
      className="p-0 h-auto text-sm"
      onClick={handleResetPassword}
      disabled={isSendingReset}
    >
      {isSendingReset ? 'Ուղարկվում է...' : 'Մոռացել եք գաղտնաբառը?'}
    </Button>
  );
};

export default ForgotPasswordForm;
