
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';
import { toast } from 'sonner';
import { isDesignatedAdmin, verifyDesignatedAdmin, checkFirstAdmin, approveFirstAdmin } from '../utils';

export const registerUser = async (
  userData: Partial<DBUser> & { password: string }
): Promise<boolean> => {
  try {
    console.log('Registering user with data:', { ...userData, password: '******' });
    
    // Clean up email input
    const cleanEmail = userData.email ? userData.email.trim().toLowerCase() : '';
    userData.email = cleanEmail;
    
    // Check if this is the designated admin account
    const isAdmin = await isDesignatedAdmin(cleanEmail);
    
    // Check if this is the first admin (if role is admin)
    let isFirstAdmin = false;
    if (userData.role === 'admin' && !isAdmin) {
      isFirstAdmin = await checkFirstAdmin();
      console.log('Checking if first admin:', isFirstAdmin);
    }
    
    // For admin account, verify it first
    if (isAdmin) {
      console.log('Admin registration detected, ensuring admin verification first');
      try {
        const { error: verifyError } = await supabase.rpc('verify_designated_admin');
        if (verifyError) {
          console.error('Error verifying admin before registration:', verifyError);
        } else {
          console.log('Admin verified successfully before registration');
        }
      } catch (err) {
        console.error('Error in admin verification before registration:', err);
      }
    }
    
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: isAdmin ? 'admin' : userData.role,
          organization: userData.organization
        },
        emailRedirectTo: `${window.location.origin}/verify-email`
      }
    });

    if (authError) {
      console.error('Error registering user with Supabase Auth:', authError);
      
      if (authError.message.includes('already registered')) {
        // For admin account, try to verify and continue
        if (isAdmin) {
          console.log('Admin account already exists, verifying it');
          try {
            await verifyDesignatedAdmin(cleanEmail);
            toast.success('Ադմինի հաշիվը հաջողությամբ հաստատվել է', {
              description: 'Դուք կարող եք հիմա մուտք գործել համակարգ'
            });
            return true;
          } catch (verifyErr) {
            console.error('Error verifying existing admin account:', verifyErr);
          }
        }
        
        toast.error('Օգտատերը արդեն գրանցված է', {
          description: 'Այս էլ․ հասցեով օգտատեր արդեն գոյություն ունի: Փորձեք մուտք գործել կամ վերականգնել գաղտնաբառը'
        });
      } else {
        toast.error('Գրանցումը չի հաջողվել', {
          description: authError.message
        });
      }
      
      return false;
    }

    console.log('User registered successfully with Auth:', authData.user?.id);
    
    // For designated admin, ensure verification
    if (isAdmin && authData.user) {
      console.log('Designated admin detected, ensuring verification');
      await verifyDesignatedAdmin(cleanEmail);
      
      // Attempt to automatically sign in the admin after registration
      try {
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: userData.password
        });
        console.log('Auto-login for admin successful');
      } catch (signInError) {
        console.error('Auto-login for admin failed:', signInError);
      }
    }
    
    // For first admin (not the designated one), approve them
    if (isFirstAdmin && authData.user) {
      console.log('First admin detected, ensuring approval');
      await approveFirstAdmin(cleanEmail);
      
      // Update profile to set as admin
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          role: 'admin', 
          registration_approved: true 
        })
        .eq('id', authData.user.id);
        
      if (updateError) {
        console.error('Error updating first admin profile:', updateError);
      } else {
        console.log('First admin profile updated successfully');
      }
      
      // Attempt to automatically sign in the first admin after registration
      try {
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: userData.password
        });
        console.log('Auto-login for first admin successful');
      } catch (signInError) {
        console.error('Auto-login for first admin failed:', signInError);
      }
    }

    // If automatic profile creation via trigger doesn't work, create manually
    if (authData.user && !isAdmin) {
      const { error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('id', authData.user.id)
        .single();
        
      if (profileError) {
        console.log('Profile may not exist, creating manually');
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: userData.name,
            email: cleanEmail,
            role: isFirstAdmin ? 'admin' : userData.role,
            organization: userData.organization,
            registration_approved: userData.role === 'student' || isFirstAdmin, // Auto-approve students and first admin
          });

        if (insertError) {
          console.error('Error creating user profile manually:', insertError);
        }
      }
    }

    if (isAdmin) {
      toast.success('Ադմինի հաշիվը հաջողությամբ ստեղծվել է', {
        description: 'Դուք կարող եք հիմա մուտք գործել համակարգ'
      });
    } else if (isFirstAdmin) {
      toast.success('Առաջին ադմինի հաշիվը հաջողությամբ ստեղծվել է', {
        description: 'Դուք կարող եք հիմա մուտք գործել համակարգ'
      });
    } else {
      toast.success('Գրանցումը հաջողված է', {
        description: 'Ստուգեք Ձեր էլ․ փոստը հաստատման հղման համար'
      });
    }

    return true;
  } catch (error) {
    console.error('Unexpected error during registration:', error);
    toast.error('Սխալ', {
      description: 'Տեղի ունեցավ անսպասելի սխալ գրանցման ընթացքում'
    });
    return false;
  }
};
