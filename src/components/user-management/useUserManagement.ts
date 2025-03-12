
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNewUser, setOpenNewUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'student',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '',
    group: ''
  });

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
          
          // Fallback to mock data if Supabase fails
          setUsers(mockUsers);
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
        // Fallback to mock data
        setUsers(mockUsers);
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
        // Fallback to local creation
        const id = `user-${Date.now()}`;
        const createdUser: User = {
          id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role as UserRole,
          department: newUser.department,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
          course: newUser.role === 'student' ? newUser.course : undefined,
          group: newUser.role === 'student' ? newUser.group : undefined
        };

        setUsers(prev => [...prev, createdUser]);
        toast.success(`${createdUser.name} օգտատերը հաջողությամբ ստեղծվել է (Լոկալ)։`);
      } else if (authData.user) {
        // If successful, create user profile in users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .upsert({
            id: authData.user.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role as UserRole,
            department: newUser.department,
            course: newUser.role === 'student' ? newUser.course : undefined,
            group_name: newUser.role === 'student' ? newUser.group : undefined,
            registration_approved: true,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`
          });

        if (userError) {
          console.error('Error creating user in users table:', userError);
          toast.error("Սխալ է տեղի ունեցել օգտատիրոջը ստեղծելիս։");
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
    }

    setNewUser({
      name: '',
      email: '',
      role: 'student',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      course: '',
      group: ''
    });
    setOpenNewUser(false);
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

    try {
      const userToUpdate = users.find(user => user.id === openEditUser);
      if (!userToUpdate) return;

      // Update user in Supabase
      const { data, error } = await supabase
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
        // Still update local state for better UX
        toast.warning("Տվյալների բազայի սինքրոնիզացումը ձախողվեց, բայց լոկալ փոփոխությունները պահպանվել են։");
      } else {
        toast.success("Օգտատիրոջ տվյալները հաջողությամբ թարմացվել են։");
      }

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
    } catch (error) {
      console.error('Error in handleUpdateUser:', error);
      toast.error("Սխալ է տեղի ունեցել օգտատիրոջ տվյալները թարմացնելիս։");
    }
    
    setNewUser({
      name: '',
      email: '',
      role: 'student',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      course: '',
      group: ''
    });
    
    setOpenEditUser(null);
  };

  const handleAssignSupervisor = async (studentId: string, supervisorId: string) => {
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
    }
  };

  const handleDeleteUser = async (userId: string) => {
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
    }
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
    setOpenNewUser,
    setNewUser,
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleAssignSupervisor,
    handleDeleteUser
  };
};
