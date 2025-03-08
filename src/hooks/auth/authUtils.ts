
import { User, UserRole } from '@/data/userRoles';

// Helper function to convert Supabase user to our User type
export const mapSupabaseUserToUser = (supabaseUser: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || 'User',
    role: (supabaseUser.user_metadata?.role as UserRole) || 'student',
    registrationApproved: supabaseUser.user_metadata?.registration_approved || false,
    avatar: supabaseUser.user_metadata?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
    ...(supabaseUser.user_metadata?.organization ? { organization: supabaseUser.user_metadata.organization } : {}),
    ...(supabaseUser.user_metadata?.department ? { department: supabaseUser.user_metadata.department } : {})
  };
};
