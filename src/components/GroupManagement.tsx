
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { getStudentsByCourseAndGroup, getCourses, getUsersByRole, mockUsers, User } from '@/data/userRoles';

interface Group {
  id: string;
  name: string;
  course: string;
  lecturerId: string;
  students: string[];
}

// Mock data
const mockGroups: Group[] = [
  {
    id: '1',
    name: 'ԿՄ-021',
    course: '2',
    lecturerId: 'lecturer1',
    students: ['student1']
  },
  {
    id: '2',
    name: 'ԿՄ-031',
    course: '3',
    lecturerId: 'lecturer1',
    students: ['student2']
  }
];

const GroupManagement: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newGroup, setNewGroup] = useState<Partial<Group>>({
    name: '',
    course: '',
    lecturerId: '',
    students: []
  });
  const [availableStudents, setAvailableStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  const isAdmin = user?.role === 'admin';
  const courses = getCourses();
  const lecturers = getUsersByRole('lecturer').concat(getUsersByRole('instructor'));

  const handleAddGroup = () => {
    if (!newGroup.name || !newGroup.course || !newGroup.lecturerId) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const groupToAdd: Group = {
      id: uuidv4(),
      name: newGroup.name,
      course: newGroup.course,
      lecturerId: newGroup.lecturerId,
      students: newGroup.students || []
    };

    setGroups([...groups, groupToAdd]);
    setNewGroup({
      name: '',
      course: '',
      lecturerId: '',
      students: []
    });
    setIsAddDialogOpen(false);
    toast.success('Խումբը հաջողությամբ ավելացվել է');
  };

  const handleViewGroup = (group: Group) => {
    setSelectedGroup(group);
    setAvailableStudents(mockUsers.filter(user => 
      user.role === 'student' && 
      (!group.students.includes(user.id))
    ));
    setIsViewDialogOpen(true);
  };

  const handleAddStudent = () => {
    if (!selectedStudent || !selectedGroup) return;
    
    const updatedGroups = groups.map(group => {
      if (group.id === selectedGroup.id) {
        return {
          ...group,
          students: [...group.students, selectedStudent]
        };
      }
      return group;
    });
    
    setGroups(updatedGroups);
    setSelectedGroup({
      ...selectedGroup,
      students: [...selectedGroup.students, selectedStudent]
    });
    
    setAvailableStudents(availableStudents.filter(student => student.id !== selectedStudent));
    setSelectedStudent('');
    toast.success('Ուսանողը հաջողությամբ ավելացվել է խմբում');
  };

  const handleRemoveStudent = (studentId: string) => {
    if (!selectedGroup) return;
    
    const updatedGroups = groups.map(group => {
      if (group.id === selectedGroup.id) {
        return {
          ...group,
          students: group.students.filter(id => id !== studentId)
        };
      }
      return group;
    });
    
    setGroups(updatedGroups);
    setSelectedGroup({
      ...selectedGroup,
      students: selectedGroup.students.filter(id => id !== studentId)
    });
    
    const student = mockUsers.find(user => user.id === studentId);
    if (student) {
      setAvailableStudents([...availableStudents, student]);
    }
    
    toast.success('Ուսանողը հաջողությամբ հեռացվել է խմբից');
  };

  const handleDeleteGroup = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
    toast.success('Խումբը հաջողությամբ հեռացվել է');
  };

  const getLecturerName = (id: string) => {
    const lecturer = mockUsers.find(user => user.id === id);
    return lecturer ? lecturer.name : 'Անհայտ';
  };

  const getStudentCount = (studentIds: string[]) => {
    return studentIds.length;
  };

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
                      {courses.map((course) => (
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
                    value={newGroup.lecturerId} 
                    onValueChange={(value) => setNewGroup({ ...newGroup, lecturerId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ընտրեք դասախոսին" />
                    </SelectTrigger>
                    <SelectContent>
                      {lecturers.map((lecturer) => (
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
                  <span>{getLecturerName(group.lecturerId)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Ուսանողներ:</span>
                  <span>{getStudentCount(group.students)}</span>
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

      {/* View Group Dialog */}
      {selectedGroup && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Խումբ: {selectedGroup.name}</DialogTitle>
              <DialogDescription>
                Կուրս: {selectedGroup.course} | Դասախոս: {getLecturerName(selectedGroup.lecturerId)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Ուսանողներ</h3>
                {selectedGroup.students.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Այս խմբում դեռ ուսանողներ չկան</p>
                ) : (
                  <div className="space-y-2">
                    {selectedGroup.students.map(studentId => {
                      const student = mockUsers.find(user => user.id === studentId);
                      return student ? (
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
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              
              {isAdmin && (
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Ուսանողի ավելացում</h3>
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
