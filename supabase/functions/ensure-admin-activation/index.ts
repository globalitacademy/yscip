
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

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
    console.log('Ensuring admin activation...')
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    )

    // First reset admin account to ensure it exists properly
    const { data: resetData, error: resetError } = await supabaseAdmin.rpc('reset_admin_account')
    
    if (resetError) {
      console.error('Error resetting admin account:', resetError)
      // Still try the other methods as fallback
    } else {
      console.log('Admin account reset successfully')
    }
    
    // Now verify that the admin account exists and is properly set up
    await supabaseAdmin.rpc('verify_designated_admin')
    
    // Also ensure login is enabled for the admin account
    const { data, error } = await supabaseAdmin.rpc('ensure_admin_login')

    if (error) {
      console.error('Error ensuring admin login:', error)
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    console.log('Admin activation successful')
    
    // Return success 
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
