
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUserDeletion = (
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  showConfirm: (title: string, description: string, action: () => Promise<void>) => void,
  setIsConfirming: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) return;

    showConfirm(
      "Ջնջել օգտատիրոջը",
      `Դուք պատրաստվում եք ջնջել "${userToDelete.name}" օգտատիրոջը: Այս գործողությունը անդառնալի է: Դուք հաստատո՞ւմ եք այս գործողությունը:`,
      async () => {
        setIsConfirming(true);
        try {
          // Try to delete from Supabase
          const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

          if (error) {
            console.error('Error deleting user from Supabase:', error);
            // Continue with local deletion for better UX
            toast.warning("Տվյալների բազայի սինքրոնիզացումը ձախողվեց, բայց լոկալ փոփոխությունները պահպանվել են։");
          } else {
            // Try to delete from auth as well
            await supabase.auth.admin.deleteUser(userId);
          }

          // Update local state
          setUsers(prev => prev.filter(user => user.id !== userId));
          toast.success("Օգտատերը հաջողությամբ ջնջվել է համակարգից։");
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.error("Սխալ է տեղի ունեցել օգտատիրոջը ջնջելիս։");
        } finally {
          setIsConfirming(false);
        }
      }
    );
  };

  return {
    handleDeleteUser
  };
};
