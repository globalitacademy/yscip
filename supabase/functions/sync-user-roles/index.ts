
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request
    const { action, userId, data } = await req.json();
    
    let result;
    
    // Perform requested action
    switch (action) {
      case 'sync_roles':
        result = await syncUserRoles(supabase);
        break;
      case 'update_role':
        if (!userId || !data?.role) {
          return new Response(
            JSON.stringify({ error: 'Missing userId or role' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        result = await updateUserRole(supabase, userId, data.role);
        break;
      case 'check_permissions':
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'Missing userId' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        result = await checkUserPermissions(supabase, userId);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in sync-user-roles function:", error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Sync roles between auth.users and public.users
async function syncUserRoles(supabase) {
  // Get all users from auth.users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    throw authError;
  }
  
  // Get all users from public.users
  const { data: publicUsers, error: publicError } = await supabase
    .from('users')
    .select('*');
    
  if (publicError) {
    throw publicError;
  }
  
  const results = {
    updated: 0,
    created: 0,
    errors: 0,
    details: []
  };
  
  // Process each auth user
  for (const authUser of authUsers.users) {
    const publicUser = publicUsers.find(u => u.id === authUser.id);
    
    try {
      if (publicUser) {
        // Update existing user if metadata differs
        if (authUser.user_metadata?.role && authUser.user_metadata.role !== publicUser.role) {
          const { error } = await supabase
            .from('users')
            .update({ 
              role: authUser.user_metadata.role,
              updated_at: new Date().toISOString()
            })
            .eq('id', authUser.id);
            
          if (error) throw error;
          results.updated++;
          results.details.push({
            id: authUser.id,
            action: 'updated',
            success: true
          });
        }
      } else {
        // Create new public user if missing
        const { error } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || 'Unnamed User',
            role: authUser.user_metadata?.role || 'student',
            registration_approved: true,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}`
          });
          
        if (error) throw error;
        results.created++;
        results.details.push({
          id: authUser.id,
          action: 'created',
          success: true
        });
      }
    } catch (error) {
      results.errors++;
      results.details.push({
        id: authUser.id,
        action: publicUser ? 'update' : 'create',
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// Update a user's role
async function updateUserRole(supabase, userId, role) {
  try {
    // Update in public.users
    const { error: publicError } = await supabase
      .from('users')
      .update({ 
        role: role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (publicError) throw publicError;
    
    // Update user metadata in auth.users
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        user_metadata: { role: role } 
      }
    );
    
    if (authError) throw authError;
    
    return {
      success: true,
      message: 'User role updated successfully'
    };
  } catch (error) {
    console.error('Error updating user role:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Check user permissions based on role
async function checkUserPermissions(supabase, userId) {
  try {
    // Get user from public.users
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    // Calculate permissions based on role
    const permissions = {
      canViewDashboard: ['admin', 'project_manager', 'supervisor'].includes(user.role),
      canManageUsers: ['admin'].includes(user.role),
      canApproveProjects: ['admin', 'project_manager'].includes(user.role),
      canCreateProjects: ['admin', 'project_manager', 'lecturer', 'instructor'].includes(user.role),
      canSubmitProposals: ['employer', 'student'].includes(user.role),
      canViewAllProjects: ['admin', 'project_manager'].includes(user.role),
      canAssignStudents: ['admin', 'project_manager', 'supervisor'].includes(user.role)
    };
    
    return {
      success: true,
      user: {
        id: user.id,
        role: user.role,
        name: user.name
      },
      permissions
    };
  } catch (error) {
    console.error('Error checking user permissions:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
