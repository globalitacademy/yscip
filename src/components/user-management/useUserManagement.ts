
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
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*');
        
        if (error) {
          console.error('Error fetching users:', error);
          toast.error('Սխալ է տեղի ունեցել օգտատերերի տվյալները բեռնելիս։');
          setUsers([]);
        } else if (data) {
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
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
            toast.error(`Սխալ է տեղի ունեցել օգտատիրոջ ստեղծման ժամանակ: ${authError.message}`);
          } else if (authData.user) {
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
              toast.error(`Սխալ է տեղի ունեցել օգտատիրոջ պրոֆիլը ստեղծելիս: ${userError.message}`);
            } else {
              // Add the new user to the local state
              const createdUser: User = {
                id: authData.user.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role as UserRole,
                department: newUser.department,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`,
                course: newUser.role === 'student' ? newUser.course : undefined,
                group: newUser.role === 'student' ? newUser.group : undefined,
                registrationApproved: true
              };

              setUsers(prev => [...prev, createdUser]);
              toast.success(`${createdUser.name} օգտատերը հաջողությամբ ստեղծվել է։`);
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
            toast.error(`Սխալ է տեղի ունեցել օգտատիրոջ տվյալները թարմացնելիս: ${error.message}`);
          } else {
            // Update local state
            setUsers(prev => prev.map(user => {
              if (user.id === openEditUser) {
                return {
                  ...user,
                  name: newUser.name || user.name,
                  email: newUser.email || user.email,
                  role: newUser.role as UserRole || user.role,
                  department: newUser.department || user.department,
                  course: newUser.role === 'student' ? newUser.course : undefined,
                  group: newUser.role === 'student' ? newUser.group : undefined
                };
              }
              return user;
            }));
            toast.success("Օգտատիրոջ տվյալները հաջողությամբ թարմացվել են։");
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
          // Create a project assignment record for supervisor relationship
          const { error } = await supabase
            .from('project_assignments')
            .insert({
              student_id: studentId,
              supervisor_id: supervisorId,
              status: 'assigned'
            });

          if (error) {
            console.error('Error assigning supervisor:', error);
            toast.error(`Սխալ է տեղի ունեցել ղեկավար նշանակելիս: ${error.message}`);
          } else {
            toast.success("Ուսանողին հաջողությամբ նշանակվել է ղեկավար։");
          }
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
          // Try to delete from Supabase
          const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

          if (error) {
            console.error('Error deleting user from Supabase:', error);
            toast.error(`Սխալ է տեղի ունեցել օգտատիրոջը ջնջելիս: ${error.message}`);
          } else {
            // Try to delete from auth as well
            const { error: authError } = await supabase.auth.admin.deleteUser(userId);
            if (authError) {
              console.error('Error deleting user from auth:', authError);
            }
            
            // Update local state
            setUsers(prev => prev.filter(user => user.id !== userId));
            toast.success("Օգտատերը հաջողությամբ ջնջվել է համակարգից։");
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.error("Սխալ է տեղի ունեցել օգտատիրոջը ջնջելիս։");
        } finally {
          setIsConfirming(false);
        }
      }
    );
  };

  // Filter out supervisors and students from the real users
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
    setShowConfirmDialog
  };
};
