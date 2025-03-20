
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Group, GroupStudent, NewGroupData } from './types';
import { User } from '@/types/user';
import { useGroupEvents } from './useGroupEvents';

export const useGroupManagement = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groupStudents, setGroupStudents] = useState<GroupStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newGroup, setNewGroup] = useState<NewGroupData>({
    name: '',
    course: '',
    lecturer_id: ''
  });
  const [availableStudents, setAvailableStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  // Use the real-time subscription hook
  useGroupEvents(setGroups, setGroupStudents);

  // Fetch all users and groups from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch groups
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('*');
        
        if (groupsError) {
          console.error('Error fetching groups:', groupsError);
          toast.error('Սխալ է տեղի ունեցել խմբերի տվյալները բեռնելիս։');
        } else {
          setGroups(groupsData || []);
        }
        
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*');
        
        if (usersError) {
          console.error('Error fetching users:', usersError);
          toast.error('Սխալ է տեղի ունեցել օգտատերերի տվյալները բեռնելիս։');
        } else {
          // Map to User type
          const mappedUsers: User[] = (usersData || []).map(dbUser => ({
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role as any,
            department: dbUser.department || '',
            avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.id}`,
            course: dbUser.course,
            group: dbUser.group_name,
            registrationApproved: dbUser.registration_approved,
            organization: dbUser.organization
          }));
          
          setUsers(mappedUsers);
        }
        
        // Fetch group_students
        const { data: groupStudentsData, error: groupStudentsError } = await supabase
          .from('group_students')
          .select('*');
        
        if (groupStudentsError) {
          console.error('Error fetching group students:', groupStudentsError);
          toast.error('Սխալ է տեղի ունեցել խմբերի ուսանողների տվյալները բեռնելիս։');
        } else {
          setGroupStudents(groupStudentsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Սխալ է տեղի ունեցել տվյալները բեռնելիս։');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAddGroup = async () => {
    if (!newGroup.name || !newGroup.course || !newGroup.lecturer_id) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('groups')
        .insert({
          name: newGroup.name,
          course: newGroup.course,
          lecturer_id: newGroup.lecturer_id
        })
        .select();
      
      if (error) {
        console.error('Error adding group:', error);
        toast.error(`Սխալ է տեղի ունեցել խումբն ավելացնելիս: ${error.message}`);
        return;
      }
      
      if (data && data.length > 0) {
        setGroups(prev => [...prev, data[0] as Group]);
        toast.success('Խումբը հաջողությամբ ավելացվել է');
        setNewGroup({
          name: '',
          course: '',
          lecturer_id: ''
        });
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error in handleAddGroup:', error);
      toast.error('Սխալ է տեղի ունեցել խումբն ավելացնելիս։');
    }
  };

  const handleViewGroup = (group: Group) => {
    setSelectedGroup(group);
    
    // Find all student IDs who are already in this group
    const studentIdsInGroup = groupStudents
      .filter(gs => gs.group_id === group.id)
      .map(gs => gs.student_id);
    
    // Get all students who are not in this group
    const availStudents = users.filter(user => 
      user.role === 'student' && 
      !studentIdsInGroup.includes(user.id)
    );
    
    setAvailableStudents(availStudents);
    setIsViewDialogOpen(true);
  };

  const handleAddStudent = async () => {
    if (!selectedStudent || !selectedGroup) return;
    
    try {
      const { error } = await supabase
        .from('group_students')
        .insert({
          group_id: selectedGroup.id,
          student_id: selectedStudent
        });
      
      if (error) {
        console.error('Error adding student to group:', error);
        toast.error(`Սխալ է տեղի ունեցել ուսանողին խմբում ավելացնելիս: ${error.message}`);
        return;
      }
      
      // Fetch the newly created record to get its ID
      const { data: newRecordData } = await supabase
        .from('group_students')
        .select('*')
        .eq('group_id', selectedGroup.id)
        .eq('student_id', selectedStudent)
        .single();
      
      // Update local state
      if (newRecordData) {
        setGroupStudents(prev => [
          ...prev, 
          newRecordData as GroupStudent
        ]);
      }
      
      // Update user's group in users table
      await supabase
        .from('users')
        .update({ group_name: selectedGroup.name })
        .eq('id', selectedStudent);
      
      // Remove student from available students
      setAvailableStudents(prev => prev.filter(student => student.id !== selectedStudent));
      setSelectedStudent('');
      toast.success('Ուսանողը հաջողությամբ ավելացվել է խմբում');
    } catch (error) {
      console.error('Error in handleAddStudent:', error);
      toast.error('Սխալ է տեղի ունեցել ուսանողին խմբում ավելացնելիս։');
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!selectedGroup) return;
    
    try {
      // Find the group_student record to delete
      const recordToDelete = groupStudents.find(gs => 
        gs.group_id === selectedGroup.id && gs.student_id === studentId
      );
      
      if (!recordToDelete) {
        toast.error('Ուսանողի և խմբի կապը չի գտնվել');
        return;
      }
      
      const { error } = await supabase
        .from('group_students')
        .delete()
        .eq('id', recordToDelete.id);
      
      if (error) {
        console.error('Error removing student from group:', error);
        toast.error(`Սխալ է տեղի ունեցել ուսանողին խմբից հեռացնելիս: ${error.message}`);
        return;
      }
      
      // Update local state
      setGroupStudents(prev => prev.filter(gs => gs.id !== recordToDelete.id));
      
      // Update user's group in users table
      await supabase
        .from('users')
        .update({ group_name: null })
        .eq('id', studentId);
      
      // Add student back to available students
      const student = users.find(u => u.id === studentId);
      if (student) {
        setAvailableStudents(prev => [...prev, student]);
      }
      
      toast.success('Ուսանողը հաջողությամբ հեռացվել է խմբից');
    } catch (error) {
      console.error('Error in handleRemoveStudent:', error);
      toast.error('Սխալ է տեղի ունեցել ուսանողին խմբից հեռացնելիս։');
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      // First delete all group_students entries for this group
      const { error: gsError } = await supabase
        .from('group_students')
        .delete()
        .eq('group_id', id);
      
      if (gsError) {
        console.error('Error deleting group students:', gsError);
        toast.error(`Սխալ է տեղի ունեցել խմբի ուսանողներին հեռացնելիս: ${gsError.message}`);
        return;
      }
      
      // Then delete the group itself
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting group:', error);
        toast.error(`Սխալ է տեղի ունեցել խումբը ջնջելիս: ${error.message}`);
        return;
      }
      
      // Update local state
      setGroups(prev => prev.filter(group => group.id !== id));
      setGroupStudents(prev => prev.filter(gs => gs.group_id !== id));
      toast.success('Խումբը հաջողությամբ հեռացվել է');
    } catch (error) {
      console.error('Error in handleDeleteGroup:', error);
      toast.error('Սխալ է տեղի ունեցել խումբը ջնջելիս։');
    }
  };

  const getLecturerName = (id: string) => {
    const lecturer = users.find(user => user.id === id);
    return lecturer ? lecturer.name : 'Անհայտ';
  };

  const getStudentCount = (groupId: string) => {
    return groupStudents.filter(gs => gs.group_id === groupId).length;
  };
  
  const getGroupStudents = (groupId: string) => {
    const studentIds = groupStudents
      .filter(gs => gs.group_id === groupId)
      .map(gs => gs.student_id);
    
    return users.filter(user => studentIds.includes(user.id));
  };

  const getCourses = () => {
    return ['1', '2', '3', '4', '5'];
  };

  const getLecturers = () => {
    return users.filter(user => 
      user.role === 'lecturer' || user.role === 'instructor'
    );
  };

  return {
    groups,
    users,
    groupStudents,
    isLoading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedGroup,
    setSelectedGroup,
    newGroup,
    setNewGroup,
    availableStudents,
    selectedStudent,
    setSelectedStudent,
    handleAddGroup,
    handleViewGroup,
    handleAddStudent,
    handleRemoveStudent,
    handleDeleteGroup,
    getLecturerName,
    getStudentCount,
    getGroupStudents,
    getCourses,
    getLecturers
  };
};
