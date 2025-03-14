
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting admin account activation process')
    
    // Get Supabase URL and service key from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables for Supabase connection')
    }
    
    // Create Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('Supabase client created')
    
    // Admin credentials - these are kept in the Edge Function but not exposed to frontend
    const adminEmail = 'gitedu@bk.ru'
    const adminPassword = 'Qolej2025*'
    
    // Step 1: Check if admin exists in auth.users
    const { data: existingUsers, error: usersError } = await supabase
      .from('users')
      .select('id, email, role, registration_approved')
      .eq('email', adminEmail)
    
    console.log(`Admin user check: ${existingUsers?.length ?? 0} users found`)
    
    let adminId = null
    
    // If admin doesn't exist in auth.users, create it
    if (!existingUsers || existingUsers.length === 0) {
      console.log('Admin user not found, creating new admin')
      
      // Create admin in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          name: 'Ադմինիստրատոր',
          role: 'admin'
        }
      })
      
      if (authError) {
        console.error('Error creating admin auth user')
        throw authError
      }
      
      console.log('Auth user created successfully')
      adminId = authData.user.id
      
      // Create admin in public.users if not exists
      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert({
          id: adminId,
          email: adminEmail,
          name: 'Ադմինիստրատոր',
          role: 'admin',
          registration_approved: true,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin${Date.now()}`
        })
      
      if (userError) {
        console.error('Error creating admin in users table')
        throw userError
      }
      
      console.log('Public user created/updated successfully')
    } else {
      console.log('Admin user found, ensuring it is properly set up')
      adminId = existingUsers[0].id
      
      // Update existing admin user to ensure it's properly set up
      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'admin',
          registration_approved: true,
          name: existingUsers[0].name || 'Ադմինիստրատոր'
        })
        .eq('id', adminId)
      
      if (updateError) {
        console.error('Error updating admin user')
        throw updateError
      }
      
      console.log('Admin user updated successfully')
      
      // Reset admin password if needed
      try {
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          adminId,
          { password: adminPassword, email_confirm: true }
        )
        
        if (passwordError) {
          console.error('Error updating admin password')
        } else {
          console.log('Admin password updated successfully')
        }
      } catch (e) {
        console.error('Exception updating password')
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin account activated successfully',
        adminId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error) {
    console.error('Error in ensure-admin-activation')
    return new Response(
      JSON.stringify({ success: false, error: 'Internal Server Error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
