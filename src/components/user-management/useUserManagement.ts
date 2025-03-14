
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNewUser, setOpenNewUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => async () => {});
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'student',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '',
    group: ''
  });

  // Function to show confirmation dialog
  const showConfirm = (title: string, description: string, action: () => Promise<void>) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    setConfirmAction(() => action);
    setShowConfirmDialog(true);
  };

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Սխալ է տեղի ունեցել օգտատերերի տվյալները բեռնելիս։');
        return;
      }
      
      if (data) {
        // Map Supabase users to our User type
        const mappedUsers: User[] = data.map(dbUser => ({
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role as UserRole,
          department: dbUser.department || '',
          avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.id}`,
          course: dbUser.course,
          group: dbUser.group_name,
          registrationApproved: dbUser.registration_approved,
          organization: dbUser.organization
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error('Սխալ է տեղի ունեցել օգտատերերի տվյալները բեռնելիս։');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Set up real-time subscription for user changes
    const channel = supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' }, 
        () => {
          fetchUsers();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error("Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը");
      return;
    }

    // Show confirmation dialog
    showConfirm(
      "Ստեղծել նոր օգտատեր",
      `Դուք պատրաստվում եք ստեղծել նոր օգտատեր անունով "${newUser.name}": Դուք հաստատո՞ւմ եք այս գործողությունը:`,
      async () => {
        setIsConfirming(true);
        try {
          // First try to create user in Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: newUser.email,
            email_confirm: true,
            user_metadata: {
              name: newUser.name,
              role: newUser.role
            },
            password: 'Password123!' // Temporary password
          });

          if (authError) {
            console.error('Error creating user in auth:', authError);
            toast.error(`Սխալ է տեղի ունեցել օգտատիրոջը ստեղծելիս: ${authError.message}`);
            return;
          }
          
          if (authData.user) {
            // If successful, create user profile in users table
            const { error: userError } = await supabase
              .from('users')
              .upsert({
                id: authData.user.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role as UserRole,
                department: newUser.department,
                course: newUser.role === 'student' ? newUser.course : null,
                group_name: newUser.role === 'student' ? newUser.group : null,
                registration_approved: true,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`
              });

            if (userError) {
              console.error('Error creating user in users table:', userError);
              toast.error("Սխալ է տեղի ունեցել օգտատիրոջը ստեղծելիս։");
            } else {
              toast.success(`${newUser.name} օգտատերը հաջողությամբ ստեղծվել է։`);
              fetchUsers(); // Refresh user list
            }
          }
        } catch (error) {
          console.error('Error creating user:', error);
          toast.error("Սխալ է տեղի ունեցել օգտատիրոջը ստեղծելիս։");
        } finally {
          setIsConfirming(false);
          setNewUser({
            name: '',
            email: '',
            role: 'student',
            department: 'Ինֆորմատիկայի ֆակուլտետ',
            course: '',
            group: ''
          });
          setOpenNewUser(false);
        }
      }
    );
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      course: user.course,
      group: user.group
    });
    
    setOpenEditUser(userId);
  };
  
  const handleUpdateUser = async () => {
    if (!openEditUser) return;

    // Show confirmation dialog
    const userToUpdate = users.find(user => user.id === openEditUser);
    if (!userToUpdate) return;

    showConfirm(
      "Թարմացնել օգտատիրոջ տվյալները",
      `Դուք պատրաստվում եք թարմացնել "${userToUpdate.name}" օգտատիրոջ տվյալները: Դուք հաստատո՞ւմ եք այս գործողությունը:`,
      async () => {
        setIsConfirming(true);
        try {
          // Update user in Supabase
          const { error } = await supabase
            .from('users')
            .update({
              name: newUser.name,
              role: newUser.role,
              department: newUser.department,
              course: newUser.role === 'student' ? newUser.course : null,
              group_name: newUser.role === 'student' ? newUser.group : null,
              updated_at: new Date().toISOString()
            })
            .eq('id', openEditUser);

          if (error) {
            console.error('Error updating user in Supabase:', error);
            toast.error("Սխալ է տեղի ունեցել օգտատիրոջ տվյալները թարմացնելիս։");
          } else {
            toast.success("Օգտատիրոջ տվյալները հաջողությամբ թարմացվել են։");
            fetchUsers(); // Refresh user list
          }
        } catch (error) {
          console.error('Error in handleUpdateUser:', error);
          toast.error("Սխալ է տեղի ունեցել օգտատիրոջ տվյալները թարմացնելիս։");
        } finally {
          setIsConfirming(false);
          setNewUser({
            name: '',
            email: '',
            role: 'student',
            department: 'Ինֆորմատիկայի ֆակուլտետ',
            course: '',
            group: ''
          });
          setOpenEditUser(null);
        }
      }
    );
  };

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
          // Update project_assignments table
          const { error } = await supabase
            .from('project_assignments')
            .update({ supervisor_id: supervisorId })
            .eq('student_id', studentId);

          if (error) {
            console.error('Error assigning supervisor:', error);
            
            // If no assignment exists yet, create one
            const { error: insertError } = await supabase
              .from('project_assignments')
              .insert({
                student_id: studentId,
                supervisor_id: supervisorId,
                status: 'pending'
              });
              
            if (insertError) {
              console.error('Error creating assignment:', insertError);
              toast.error("Սխալ է տեղի ունեցել ղեկավար նշանակելիս։");
              return;
            }
          }

          toast.success("Ուսանողին հաջողությամբ նշանակվել է ղեկավար։");
          fetchUsers(); // Refresh user list
        } catch (error) {
          console.error('Error assigning supervisor:', error);
          toast.error("Սխալ է տեղի ունեցել ղեկավար նշանակելիս։");
        } finally {
          setIsConfirming(false);
        }
      }
    );
  };

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) return;

    showConfirm(
      "Ջնջել օգտատիրոջը",
      `Դուք պատրաստվում եք ջնջել "${userToDelete.name}" օգտատիրոջը: Այս գործողությունը անդառնալի է: Դուք հաստատո՞ւմ եք այս գործողությունը:`,
      async () => {
        setIsConfirming(true);
        try {
          // Try to delete from auth users (this will cascade to public.users due to constraints)
          const { error } = await supabase.auth.admin.deleteUser(userId);

          if (error) {
            console.error('Error deleting user from auth:', error);
            
            // Try direct deletion from users table as fallback
            const { error: deleteError } = await supabase
              .from('users')
              .delete()
              .eq('id', userId);
              
            if (deleteError) {
              console.error('Error deleting user from users table:', deleteError);
              toast.error("Սխալ է տեղի ունեցել օգտատիրոջը ջնջելիս։");
              return;
            }
          }

          toast.success("Օգտատերը հաջողությամբ ջնջվել է համակարգից։");
          fetchUsers(); // Refresh user list
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.error("Սխալ է տեղի ունեցել օգտատիրոջը ջնջելիս։");
        } finally {
          setIsConfirming(false);
        }
      }
    );
  };

  const supervisors = users.filter(user => 
    user.role === 'supervisor' || user.role === 'project_manager'
  );
  
  const students = users.filter(user => user.role === 'student');
  
  return {
    users,
    loading,
    openNewUser,
    openEditUser,
    newUser,
    supervisors,
    students,
    showConfirmDialog,
    confirmTitle,
    confirmDescription,
    confirmAction,
    isConfirming,
    setOpenNewUser,
    setNewUser,
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleAssignSupervisor,
    handleDeleteUser,
    setShowConfirmDialog,
    fetchUsers
  };
};
