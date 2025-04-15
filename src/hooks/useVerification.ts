
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useVerification = () => {
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const { sendVerificationEmail } = useAuth();

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    
    // Show loading feedback
    const loadingId = toast.loading('Հաստատման հղումը վերաուղարկվում է...');
    
    try {
      // First try to resend via Supabase's built-in mechanism
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: resendEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) {
        console.error('Error resending verification via Supabase:', error);
        throw error;
      }
      
      // Also send our custom email for better reliability
      try {
        // Generate a verification URL
        const verificationUrl = `${window.location.origin}/verify-email?token=${verificationToken}`;
        
        // Send via our custom edge function
        const { error: edgeError } = await supabase.functions.invoke('send-verification-email', {
          body: { 
            email: resendEmail, 
            verificationUrl
          }
        });
        
        if (edgeError) {
          console.error('Error sending custom verification email:', edgeError);
        }
      } catch (customEmailError) {
        console.error('Error sending custom verification email:', customEmailError);
      }
      
      toast.dismiss(loadingId);
      toast.success('Հաստատման հղումը կրկին ուղարկված է', {
        description: 'Խնդրում ենք ստուգել Ձեր էլ․ փոստը'
      });
    } catch (e) {
      console.error('Error resending verification email:', e);
      
      // Fall back to legacy method if Supabase fails
      const result = await sendVerificationEmail(resendEmail);
      
      toast.dismiss(loadingId);
      
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
