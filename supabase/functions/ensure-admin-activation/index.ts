
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
    // The service role key bypasses RLS policies, which helps prevent infinite recursion
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

    // Call the database function to ensure admin account is set up
    // But using a direct SQL query to avoid triggering RLS policies
    const { data, error } = await supabaseAdmin.rpc("ensure_admin_login");

    if (error) {
      console.error("Error ensuring admin login:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
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
