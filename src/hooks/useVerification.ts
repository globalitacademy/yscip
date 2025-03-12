
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useVerification = () => {
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const { sendVerificationEmail } = useAuth();

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    
    const result = await sendVerificationEmail(resendEmail);
    if (result.success) {
      setVerificationToken(result.token || '');
      toast.success('Հաստատման հղումը կրկին ուղարկված է', {
        description: 'Խնդրում ենք ստուգել Ձեր էլ․ փոստը'
      });
    } else {
      toast.error('Սխալ', {
        description: 'Չհաջողվեց վերաուղարկել հաստատման հղումը'
      });
    }
  };

  const handleRegistrationSuccess = (email: string, token: string) => {
    setVerificationSent(true);
    setResendEmail(email);
    setVerificationToken(token);
  };

  return {
    verificationSent,
    resendEmail,
    verificationToken,
    handleResendVerification,
    handleRegistrationSuccess
  };
};
