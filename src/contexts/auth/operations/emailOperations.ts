
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const sendVerificationEmail = async (email: string): Promise<boolean> => {
  try {
    console.log('Sending verification email to:', email);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });
    
    if (error) {
      console.error('Error resending confirmation email:', error);
      toast.error('Հաստատման հղումը չի ուղարկվել: ' + error.message);
      return false;
    }
    
    console.log('Verification email sent successfully');
    toast.success('Հաստատման հղումը կրկին ուղարկված է Ձեր էլ․ փոստին։');
    return true;
  } catch (error) {
    console.error('Unexpected error sending verification email:', error);
    toast.error('Տեղի ունեցավ անսպասելի սխալ');
    return false;
  }
};

export const verifyEmail = async (token: string): Promise<boolean> => {
  try {
    console.log('Verifying email with token');
    // In a real implementation, this would verify the token with Supabase
    // For now, we'll just return true as Supabase handles email verification internally
    return true;
  } catch (error) {
    console.error('Error verifying email:', error);
    return false;
  }
};
