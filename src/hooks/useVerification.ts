
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AuthResponse } from '@supabase/supabase-js';

export const useVerification = () => {
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [isResending, setIsResending] = useState(false);
  const { sendVerificationEmail } = useAuth();

  const handleResendVerification = async () => {
    if (!resendEmail || isResending) return;
    
    setIsResending(true);
    const loadingId = toast.loading('Հաստատման հղումը վերաուղարկվում է...');
    
    try {
      console.log('Resending verification email to:', resendEmail);
      let emailSent = false;
      
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
      } else {
        console.log('Supabase verification email resent successfully');
        emailSent = true;
      }
      
      // Also send our custom email for better reliability
      try {
        // Generate a verification URL - use token if available, otherwise create a new URL
        const verificationUrl = verificationToken 
          ? `${window.location.origin}/verify-email?token=${verificationToken}`
          : `${window.location.origin}/verify-email`;
        
        console.log('Sending custom verification email with URL:', verificationUrl);
        
        // Send via our custom edge function
        const { error: edgeError } = await supabase.functions.invoke('send-verification-email', {
          body: { 
            email: resendEmail, 
            name: '', // We don't have the name here, could be improved
            verificationUrl
          }
        });
        
        if (edgeError) {
          console.error('Error sending custom verification email:', edgeError);
        } else {
          console.log('Custom verification email sent successfully');
          emailSent = true;
        }
      } catch (customEmailError) {
        console.error('Error in custom email sending:', customEmailError);
      }
      
      // Fall back to our legacy method as last resort
      if (!emailSent) {
        console.log('Falling back to legacy verification method');
        const result = await sendVerificationEmail(resendEmail);
        
        if (result.success && result.token) {
          setVerificationToken(result.token);
          emailSent = true;
        }
      }
      
      toast.dismiss(loadingId);
      
      if (emailSent) {
        toast.success('Հաստատման հղումը կրկին ուղարկված է', {
          description: 'Խնդրում ենք ստուգել Ձեր էլ․ փոստը'
        });
      } else {
        toast.error('Սխալ', {
          description: 'Չհաջողվեց վերաուղարկել հաստատման հղումը'
        });
      }
    } catch (e) {
      console.error('Error in verification resend process:', e);
      
      toast.dismiss(loadingId);
      toast.error('Սխալ', {
        description: 'Չհաջողվեց վերաուղարկել հաստատման հղումը'
      });
    } finally {
      setIsResending(false);
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
    isResending,
    handleResendVerification,
    handleRegistrationSuccess
  };
};
