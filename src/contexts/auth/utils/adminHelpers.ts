
import { supabase } from '@/integrations/supabase/client';

// Simple helper function to check if email is the designated admin
export function isDesignatedAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === 'gitedu@bk.ru';
}

// Ensure the designated admin is approved in the database
export async function ensureDesignatedAdminApproved(userId: string, email: string): Promise<void> {
  try {
    // Check if this is the designated admin
    if (!isDesignatedAdminEmail(email)) {
      return;
    }
    
    console.log('Ensuring designated admin is approved:', email);
    
    // Update auth.users to ensure email is verified
    await supabase.auth.updateUser({
      data: { email_confirmed: true }
    });
    
    // Update profile in users table
    const { error } = await supabase
      .from('users')
      .update({ 
        role: 'admin', 
        registration_approved: true 
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error ensuring designated admin is approved:', error);
    } else {
      console.log('Designated admin status ensured for:', email);
    }
  } catch (err) {
    console.error('Unexpected error ensuring designated admin status:', err);
  }
}

// Check if this is the first admin using the database function
export async function checkFirstAdmin(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('get_first_admin_status');

    if (error) {
      console.error('Error checking if first admin:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Unexpected error checking first admin:', err);
    return false;
  }
}

// Approve first admin
export async function approveFirstAdmin(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc(
      'approve_first_admin',
      { admin_email: email }
    );
    
    if (error) {
      console.error('Error approving first admin:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Unexpected error approving first admin:', err);
    return false;
  }
}

// Check if the email is designated admin
export async function isDesignatedAdmin(email: string): Promise<boolean> {
  // Direct check for efficiency
  return isDesignatedAdminEmail(email);
}

// Auto-approve designated admin account and process email verification
export async function verifyDesignatedAdmin(email: string): Promise<boolean> {
  if (!isDesignatedAdminEmail(email)) {
    return false;
  }
  
  try {
    console.log('Verifying designated admin:', email);
    
    // Update auth.users to ensure email is verified
    await supabase.auth.updateUser({
      data: { email_confirmed: true }
    });
    
    // Update profile in users table
    const { error } = await supabase
      .from('users')
      .update({ 
        role: 'admin',
        registration_approved: true
      })
      .eq('email', email);
    
    if (error) {
      console.error('Error verifying designated admin:', error);
      return false;
    }
    
    console.log('Successfully verified designated admin:', email);
    return true;
  } catch (err) {
    console.error('Unexpected error verifying designated admin:', err);
    return false;
  }
}
