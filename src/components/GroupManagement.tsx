
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/user';

interface Group {
  id: string;
  name: string;
  course: string;
  lecturer_id: string;
  created_at?: string;
  updated_at?: string;
}

interface GroupStudent {
  id: string;
  group_id: string;
  student_id: string;
  created_at?: string;
}

const GroupManagement: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groupStudents, setGroupStudents] = useState<GroupStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newGroup, setNewGroup] = useState<Partial<Group>>({
    name: '',
    course: '',
    lecturer_id: ''
  });
  const [availableStudents, setAvailableStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  const isAdmin = user?.role === 'admin';
  
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Խմբերի կառավարում</h1>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Ավելացնել նոր խումբ</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Նոր խմբի ավելացում</DialogTitle>
                <DialogDescription>
                  Լրացրեք խմբի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Ավելացնել" կոճակը:
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Խմբի անուն
                  </Label>
                  <Input
                    id="name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Օր. ԿՄ-021"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="course" className="text-right">
                    Կուրս
                  </Label>
                  <Select 
                    value={newGroup.course} 
                    onValueChange={(value) => setNewGroup({ ...newGroup, course: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ընտրեք կուրսը" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCourses().map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lecturer" className="text-right">
                    Դասախոս
                  </Label>
                  <Select 
                    value={newGroup.lecturer_id} 
                    onValueChange={(value) => setNewGroup({ ...newGroup, lecturer_id: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ընտրեք դասախոսին" />
                    </SelectTrigger>
                    <SelectContent>
                      {getLecturers().map((lecturer) => (
                        <SelectItem key={lecturer.id} value={lecturer.id}>
                          {lecturer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddGroup}>
                  Ավելացնել
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Բազայում խմբեր չկան։ Ավելացրեք նոր խմբեր։</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-xl">{group.name}</CardTitle>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive" 
                      onClick={() => handleDeleteGroup(group.id)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Կուրս:</span>
                    <span>{group.course}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Դասախոս:</span>
                    <span>{getLecturerName(group.lecturer_id)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Ուսանողներ:</span>
                    <span>{getStudentCount(group.id)}</span>
                  </div>
                  <div className="pt-2">
                    <Button size="sm" className="w-full" onClick={() => handleViewGroup(group)}>
                      Դիտել խումբը
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Group Dialog */}
      {selectedGroup && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Խումբ: {selectedGroup.name}</DialogTitle>
              <DialogDescription>
                Կուրս: {selectedGroup.course} | Դասախոս: {getLecturerName(selectedGroup.lecturer_id)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Ուսանողներ</h3>
                {getGroupStudents(selectedGroup.id).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Այս խմբում դեռ ուսանողներ չկան</p>
                ) : (
                  <div className="space-y-2">
                    {getGroupStudents(selectedGroup.id).map(student => (
                      <div key={student.id} className="flex justify-between items-center p-2 bg-secondary/20 rounded-md">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                        {isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive h-7 w-7" 
                            onClick={() => handleRemoveStudent(student.id)}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {isAdmin && (
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Ուսանողի ավելացում</h3>
                  {availableStudents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Բոլոր ուսանողներն արդեն խմբում են</p>
                  ) : (
                    <div className="flex gap-2">
                      <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Ընտրեք ուսանողին" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStudents.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddStudent} disabled={!selectedStudent}>Ավելացնել</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GroupManagement;
