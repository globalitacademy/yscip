
import { User } from '@/types/user';
import { toast } from 'sonner';

export const useSupervisorAssignment = (
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  showConfirm: (title: string, description: string, action: () => Promise<void>) => void,
  setIsConfirming: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleAssignSupervisor = async (studentId: string, supervisorId: string) => {
    // Show confirmation dialog
    const student = users.find(u => u.id === studentId);
    const supervisor = users.find(u => u.id === supervisorId);
    
    if (!student || !supervisor) return;

    showConfirm(
      "Նշանակել ղեկավար",
      `Դուք պատրաստվում եք նշանակել "${supervisor.name}"-ին որպես "${student.name}"-ի ղեկավար: Դուք հաստատո՞ւմ եք այս գործողությունը:`,
      async () => {
        setIsConfirming(true);
        try {
          // You would implement this with a relationship in Supabase
          // For now, we'll just update local state
          setUsers(prev => prev.map(user => {
            if (user.id === supervisorId && 
              (user.role === 'supervisor' || user.role === 'project_manager')) {
              return {
                ...user,
                supervisedStudents: [...(user.supervisedStudents || []), studentId]
              };
            }
            return user;
          }));

          toast.success("Ուսանողին հաջողությամբ նշանակվել է ղեկավար։");
        } catch (error) {
          console.error('Error assigning supervisor:', error);
          toast.error("Սխալ է տեղի ունեցել ղեկավար նշանակելիս։");
        } finally {
          setIsConfirming(false);
        }
      }
    );
  };

  return {
    handleAssignSupervisor
  };
};
