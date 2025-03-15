
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

    // Try to create or update the admin user
    const email = "gitedu@bk.ru";
    const password = "Qolej2025*";

    // Check if user exists
    const { data: existingUsers, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
    
    let adminUser = existingUsers?.users.find(user => user.email === email);
    
    if (searchError) {
      console.error("Error searching for admin user:", searchError);
    }

    if (!adminUser) {
      // Create the user if not exists
      console.log("Admin user not found, creating new admin account");
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          name: "Ադմինիստրատոր",
          role: "admin"
        }
      });

      if (error) {
        console.error("Error creating admin user:", error);
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
      
      adminUser = data.user;
      
      // Create user profile in public.users table
      await supabaseAdmin
        .from('users')
        .upsert({
          id: adminUser.id,
          email: email,
          name: "Ադմինիստրատոր",
          role: "admin",
          department: "Ադմինիստրացիա",
          registration_approved: true,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=giteduadmin`
        });
      
    } else {
      // Update existing user to ensure it's active
      console.log("Admin user found, updating admin account");
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        adminUser.id,
        { 
          email_confirm: true,
          password: password,
          user_metadata: {
            name: "Ադմինիստրատոր",
            role: "admin"
          }
        }
      );
      
      if (error) {
        console.error("Error updating admin user:", error);
      }
      
      // Ensure user profile exists in public.users table
      await supabaseAdmin
        .from('users')
        .upsert({
          id: adminUser.id,
          email: email,
          name: "Ադմինիստրատոր",
          role: "admin",
          department: "Ադմինիստրացիա", 
          registration_approved: true,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=giteduadmin`
        });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Admin account activated successfully" }),
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
