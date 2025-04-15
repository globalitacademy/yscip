
import { PendingUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const sendVerificationEmailToUser = async (email: string, token?: string): Promise<{success: boolean, token?: string}> => {
  console.log('Sending verification email to:', email);
  
  try {
    // Generate a token if none provided
    const verificationToken = token || generateVerificationToken();
    
    // Generate verification URL
    const verificationUrl = `${window.location.origin}/verify-email?token=${verificationToken}`;
    
    // Send via our custom edge function
    const { error } = await supabase.functions.invoke('send-verification-email', {
      body: { 
        email, 
        verificationUrl
      }
    });
    
    if (error) {
      console.error('Error sending verification email via edge function:', error);
      throw error;
    }
    
    return { success: true, token: verificationToken };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false };
  }
};

export const checkEmailVerificationStatus = async (token: string): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getUser(token);
    return data && data.user ? true : false;
  } catch (error) {
    console.error('Error checking verification status:', error);
    return false;
  }
};

export const verifyUserEmail = async (
  token: string, 
  pendingUsers: PendingUser[],
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>
): Promise<boolean> => {
  try {
    // Try Supabase's built-in verification first
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });
      
      if (!error) {
        console.log('Email verified via Supabase OTP');
        return true;
      }
    } catch (e) {
      console.error('Error verifying OTP:', e);
      // Continue with legacy method
    }
    
    // Legacy verification method
    const pendingUserIndex = pendingUsers.findIndex(u => u.verificationToken === token);
    
    if (pendingUserIndex === -1) {
      console.log('Token not found in pending users');
      return false;
    }
    
    console.log('Token found in pending users, verifying');
    const updatedPendingUsers = [...pendingUsers];
    updatedPendingUsers[pendingUserIndex].verified = true;
    
    if (updatedPendingUsers[pendingUserIndex].role === 'student') {
      updatedPendingUsers[pendingUserIndex].registrationApproved = true;
    }
    
    setPendingUsers(updatedPendingUsers);
    return true;
  } catch (error) {
    console.error('Error verifying email:', error);
    return false;
  }
};
