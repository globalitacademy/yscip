
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Execute SQL to ensure RLS policies are in place
    const sqlResult = await applyRLSPolicies(supabase);

    return new Response(
      JSON.stringify({
        success: true,
        message: "RLS policies have been initialized successfully",
        details: sqlResult
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error initializing RLS policies:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error initializing RLS policies",
        error: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});

async function applyRLSPolicies(supabase) {
  // Apply RLS policies for each table that might not have them yet
  
  // First, enable RLS on all tables if not enabled
  const { data: tables, error: tablesError } = await supabase.rpc("get_all_tables");
  
  if (tablesError) {
    throw tablesError;
  }
  
  const results = [];
  
  for (const table of tables) {
    const tableName = table.table_name;
    
    // Enable RLS on the table
    const { data: enableResult, error: enableError } = await supabase.rpc(
      "enable_rls_on_table",
      { table_name: tableName }
    );
    
    if (enableError && !enableError.message.includes("already enabled")) {
      results.push({
        table: tableName,
        operation: "enable_rls",
        success: false,
        error: enableError.message
      });
      continue;
    }
    
    results.push({
      table: tableName,
      operation: "enable_rls",
      success: true
    });
    
    // Apply standard policies based on table structure
    const { data: applyResult, error: applyError } = await supabase.rpc(
      "apply_standard_policies",
      { table_name: tableName }
    );
    
    if (applyError) {
      results.push({
        table: tableName,
        operation: "apply_policies",
        success: false,
        error: applyError.message
      });
      continue;
    }
    
    results.push({
      table: tableName,
      operation: "apply_policies",
      success: true,
      policies: applyResult
    });
  }
  
  return results;
}
