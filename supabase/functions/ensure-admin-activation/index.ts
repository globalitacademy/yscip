
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

    console.log("Starting multi-step admin activation process...");
    
    // Step 1: Check if admin account exists in auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    let adminUser = authUsers?.users.find(user => user.email === "gitedu@bk.ru");
    
    console.log("Step 1: Auth check - Admin user exists in auth table:", !!adminUser);
    
    // Step 2: Check if admin account exists in users table
    const { data: publicUsers, error: publicError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", "gitedu@bk.ru");
      
    const adminExists = publicUsers && publicUsers.length > 0;
    console.log("Step 2: Public check - Admin exists in public users table:", adminExists);
    
    // Step 3: Verify the admin account using the database function
    console.log("Step 3: Calling verify_designated_admin function...");
    const { data: verifyData, error: verifyError } = await supabaseAdmin.rpc("verify_designated_admin");
    
    if (verifyError) {
      console.error("Error verifying admin account:", verifyError);
    } else {
      console.log("Admin verification done");
    }

    // Step 4: Ensure admin login using the database function
    console.log("Step 4: Calling ensure_admin_login function...");
    const { data: ensureData, error: ensureError } = await supabaseAdmin.rpc("ensure_admin_login");
    
    if (ensureError) {
      console.error("Error ensuring admin login:", ensureError);
      
      // Step 5: If error, reset admin account
      console.log("Step 5: Error occurred, resetting admin account...");
      try {
        const { data: resetData, error: resetError } = await supabaseAdmin.rpc("reset_admin_account");
        
        if (resetError) {
          console.error("Error resetting admin account:", resetError);
          throw new Error("Failed to reset admin account");
        }
        
        console.log("Admin account reset successful:", resetData);
        
        // Step 6: Wait a moment before setting password
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 7: Get the newly created admin user id
        const { data: newAuthUsers } = await supabaseAdmin.auth.admin.listUsers();
        adminUser = newAuthUsers?.users.find(user => user.email === "gitedu@bk.ru");
        
        if (adminUser) {
          console.log("Step 7: Setting password for admin account");
          // Set password for the admin user
          const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            adminUser.id,
            { password: "Qolej2025*" }
          );
          
          if (updateError) {
            console.error("Error setting password:", updateError);
          } else {
            console.log("Password set successfully");
          }
        }
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
    } else {
      console.log("Admin login ensured successfully:", ensureData);
    }

    console.log("Admin activation process completed");

    // Admin login information for client reference
    const adminInfo = {
      email: "gitedu@bk.ru",
      password: "Qolej2025*"
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin account activated successfully", 
        admin: adminInfo,
        steps: {
          adminExistsInAuth: !!adminUser,
          adminExistsInPublic: adminExists,
          verificationStatus: !verifyError,
          loginEnsureStatus: !ensureError
        }
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
