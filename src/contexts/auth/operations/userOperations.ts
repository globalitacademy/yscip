
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';
import { toast } from 'sonner';
import { isDesignatedAdmin, verifyDesignatedAdmin } from '../utils';

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
    
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: isAdmin ? 'admin' : userData.role,
          organization: userData.organization
        }
      }
    });

    if (authError) {
      console.error('Error registering user with Supabase Auth:', authError);
      
      if (authError.message.includes('already registered')) {
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
            role: userData.role,
            organization: userData.organization,
            registration_approved: userData.role === 'student', // Auto-approve students
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
