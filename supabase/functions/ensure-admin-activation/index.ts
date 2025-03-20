
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.1";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key (admin privileges)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log("Ensuring admin activation...");

    // First, ensure the admin account exists and is properly configured
    const { data: verifyData, error: verifyError } = await supabaseAdmin.rpc("verify_designated_admin");
    
    if (verifyError) {
      console.error("Error verifying admin account:", verifyError);
    } else {
      console.log("Admin account verified successfully");
    }

    // Then call ensure_admin_login to ensure admin login capabilities
    const { data, error } = await supabaseAdmin.rpc("ensure_admin_login");

    if (error) {
      console.error("Error ensuring admin login:", error);
      
      // Try backup approach - reset admin account
      try {
        const { data: resetData, error: resetError } = await supabaseAdmin.rpc("reset_admin_account");
        
        if (resetError) {
          console.error("Error resetting admin account:", resetError);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }
        
        console.log("Admin account reset successfully:", resetData);
      } catch (resetCatchError) {
        console.error("Exception during admin reset:", resetCatchError);
        return new Response(
          JSON.stringify({ success: false, error: resetCatchError.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    console.log("Admin activation completed successfully:", data);

    // Admin login information for client reference
    const adminInfo = {
      email: "gitedu@bk.ru",
      password: "Qolej2025*"
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin account activated successfully", 
        admin: adminInfo 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
