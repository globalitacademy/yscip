
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/data/userRoles';
import { SupabaseAdminUser } from '@/types/auth';
import { toast } from 'sonner';

export const useAdminAuth = () => {
  // Գրանցման հաստատման ֆունկցիա ադմինիստրատորի համար
  const approveRegistration = async (userId: string, currentUser: User | null): Promise<boolean> => {
    try {
      // Ստուգել արդյոք ընթացիկ օգտատերը ադմին է կամ սուպերադմին
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
        toast.error('Միայն ադմինիստրատորը կարող է հաստատել գրանցումները։');
        return false;
      }

      // Ստանալ օգտատիրոջ տվյալները
      const { data, error } = await supabase.auth.admin.getUserById(userId);

      if (error) {
        console.error('Get user error:', error);
        return false;
      }

      if (!data.user) {
        toast.error('Օգտատերը չի գտնվել։');
        return false;
      }

      // Թարմացնել օգտատիրոջ մետա տվյալները
      const userMetadata = {
        ...data.user.user_metadata,
        registration_approved: true
      };

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: userMetadata }
      );

      if (updateError) {
        console.error('Update user error:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Approve registration error:', error);
      return false;
    }
  };

  // Ստանալ հաստատման սպասող օգտատերերին
  const getPendingUsers = async (currentUser: User | null): Promise<any[]> => {
    try {
      // Ստուգել արդյոք ընթացիկ օգտատերը ադմին է կամ սուպերադմին
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
        return [];
      }

      // Ստանալ բոլոր օգտատերերին
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('List users error:', error);
        return [];
      }
      
      // Explicit typing of users array to fix type errors
      const users = (data?.users || []) as SupabaseAdminUser[];
      
      // Ֆիլտրել հաստատման սպասող օգտատերերին
      const pendingUsers = users.filter(u => 
        u.email_confirmed_at && // Էլ. հասցեն հաստատված է
        u.user_metadata?.role && // Ունի դեր
        ['lecturer', 'employer', 'project_manager', 'supervisor'].includes(u.user_metadata.role) && // Դերը պահանջում է հաստատում
        !u.user_metadata?.registration_approved // Դեռ չի հաստատվել
      );
      
      return pendingUsers;
    } catch (error) {
      console.error('Get pending users error:', error);
      return [];
    }
  };

  return {
    approveRegistration,
    getPendingUsers
  };
};
