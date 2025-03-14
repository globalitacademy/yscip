
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // First, ensure the admin user exists in auth.users
    const adminEmail = 'gitedu@bk.ru';
    const adminPassword = 'Qolej2025*';

    // Check if admin exists
    const { data: existingUsers, error: checkError } = await supabaseAdmin.auth.admin
      .listUsers({
        page: 1, 
        perPage: 1,
        filters: {
          email: adminEmail
        }
      });

    if (checkError) {
      throw checkError;
    }

    // If admin doesn't exist, create them
    if (!existingUsers || existingUsers.users.length === 0) {
      console.log('Admin user does not exist. Creating...');
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          name: 'Administrator',
          role: 'admin'
        }
      });

      if (createError) {
        throw createError;
      }
      
      console.log('Admin user created successfully:', newUser);
    } else {
      console.log('Admin user exists. Updating...');
      // User exists, make sure they're confirmed and password works
      const adminUser = existingUsers.users[0];
      
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        adminUser.id,
        {
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: {
            name: 'Administrator',
            role: 'admin'
          }
        }
      );

      if (updateError) {
        throw updateError;
      }
      
      console.log('Admin user updated successfully');
    }

    // Now call the ensure_admin_login function to update the public.users table
    const { data, error } = await supabaseAdmin.rpc('ensure_admin_login');

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
        message: 'Admin user verified and ensured',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in ensure-admin-activation:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
