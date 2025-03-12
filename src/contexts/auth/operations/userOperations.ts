
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
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
      'is_designated_admin',
      { email_to_check: cleanEmail }
    );

    if (adminCheckError) {
      console.error('Error checking if designated admin:', adminCheckError);
    }
    
    // Check if this is the first admin (if role is admin)
    let isFirstAdmin = false;
    if (userData.role === 'admin' && !isAdmin) {
      const { data: firstAdminResult, error: firstAdminError } = await supabase.rpc('get_first_admin_status');
      
      if (firstAdminError) {
        console.error('Error checking if first admin:', firstAdminError);
      } else {
        isFirstAdmin = !!firstAdminResult;
        console.log('Checking if first admin:', isFirstAdmin);
      }
    }
    
    // For admin account, verify it first
    if (isAdmin) {
      console.log('Admin registration detected, ensuring admin verification first');
      try {
        const { error } = await supabase.rpc('ensure_admin_login');
        if (error) {
          console.error('Error verifying admin before registration:', error);
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
          organization: userData.organization,
          email_confirmed: true // Ավտոմատ հաստատել բոլոր էլ․ հասցեները
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
            const { error } = await supabase.rpc('ensure_admin_login');
            if (error) {
              console.error('Error verifying existing admin:', error);
            } else {
              toast.success('Ադմինի հաշիվը հաջողությամբ հաստատվել է', {
                description: 'Դուք կարող եք հիմա մուտք գործել համակարգ'
              });
              return true;
            }
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
    
    // For designated admin or first admin, ensure verification and auto-approval
    if ((isAdmin || isFirstAdmin) && authData.user) {
      console.log(`${isAdmin ? 'Designated admin' : 'First admin'} detected, ensuring verification`);
      
      if (isAdmin) {
        await supabase.rpc('ensure_admin_login');
      } else if (isFirstAdmin) {
        await supabase.rpc('approve_first_admin', { admin_email: cleanEmail });
      }
      
      // Auto sign-in after registration for admins
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

    // If automatic profile creation via trigger doesn't work, create manually
    if (authData.user) {
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
            role: isFirstAdmin ? 'admin' : (isAdmin ? 'admin' : userData.role),
            organization: userData.organization,
            registration_approved: true, // Ավտոմատ հաստատել բոլորին
          });

        if (insertError) {
          console.error('Error creating user profile manually:', insertError);
        }
      } else {
        // Ensure registration_approved is set to true for existing profile
        const { error: updateError } = await supabase
          .from('users')
          .update({
            registration_approved: true
          })
          .eq('id', authData.user.id);
          
        if (updateError) {
          console.error('Error updating registration_approved status:', updateError);
        }
      }
    }

    if (isAdmin) {
      toast.success('Ադմինի հաշիվը հաջողությամբ ստեղծվել է', {
        description: 'Դուք կարող եք հիմա մուտք գործել համակարգ'
      });
    } else if (isFirstAdmin) {
      toast.success('Առաջին ադմինի հաշիվը հաջողությամբ ստեղծվել է', {
        description: 'Դուք կարող եք հիմա մուտք գործել համակարգ լիարժեք իրավունքներով'
      });
    } else {
      toast.success('Գրանցումը հաջողված է', {
        description: 'Դուք կարող եք հիմա մուտք գործել համակարգ'
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
