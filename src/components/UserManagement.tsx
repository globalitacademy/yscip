
import React, { useState } from 'react';
import { User, UserRole, mockUsers, getCourses, getGroups } from '@/data/userRoles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash, UserPlus, Users, GraduationCap, BookOpen } from 'lucide-react';

interface UserManagementProps {
  // Props can be added if needed
}

const UserManagement: React.FC<UserManagementProps> = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
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
  
  const courseOptions = getCourses();
  const groupOptions = getGroups(newUser.course);

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error("Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը");
      return;
    }

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
    setNewUser({
      name: '',
      email: '',
      role: 'student',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      course: '',
      group: ''
    });
    setOpenNewUser(false);

    toast.success(`${createdUser.name} օգտատերը հաջողությամբ ստեղծվել է։`);
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
  
  const handleUpdateUser = () => {
    if (!openEditUser) return;
    
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
    
    setNewUser({
      name: '',
      email: '',
      role: 'student',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      course: '',
      group: ''
    });
    
    setOpenEditUser(null);
    toast.success("Օգտատիրոջ տվյալները հաջողությամբ թարմացվել են։");
  };

  const handleAssignSupervisor = (studentId: string, supervisorId: string) => {
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
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    toast.success("Օգտատերը հաջողությամբ ջնջվել է համակարգից։");
  };

  const supervisors = users.filter(user => 
    user.role === 'supervisor' || user.role === 'project_manager'
  );
  const students = users.filter(user => user.role === 'student');
  
  const showStudentFields = newUser.role === 'student';

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Օգտատերերի կառավարում</h2>
        <Dialog open={openNewUser} onOpenChange={setOpenNewUser}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus size={16} />
              Ավելացնել օգտատեր
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Նոր օգտատեր</DialogTitle>
              <DialogDescription>
                Ստեղծեք նոր օգտատեր համակարգում։
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Անուն Ազգանուն</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Օրինակ՝ Վահե Պետրոսյան"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Էլ․ հասցե</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Դերակատարում</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as UserRole }))}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Ընտրեք դերակատարում" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Ադմինիստրատոր</SelectItem>
                    <SelectItem value="supervisor">Ծրագրի ղեկավար</SelectItem>
                    <SelectItem value="project_manager">Պրոեկտի մենեջեր</SelectItem>
                    <SelectItem value="instructor">Դասախոս</SelectItem>
                    <SelectItem value="lecturer">Դասախոս</SelectItem>
                    <SelectItem value="student">Ուսանող</SelectItem>
                    <SelectItem value="employer">Գործատու</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Ֆակուլտետ</Label>
                <Input
                  id="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Օրինակ՝ Ինֆորմատիկայի ֆակուլտետ"
                />
              </div>
              
              {showStudentFields && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="course">Կուրս</Label>
                    <Select
                      value={newUser.course}
                      onValueChange={(value) => setNewUser(prev => ({ ...prev, course: value }))}
                    >
                      <SelectTrigger id="course">
                        <SelectValue placeholder="Ընտրեք կուրսը" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1-ին կուրս</SelectItem>
                        <SelectItem value="2">2-րդ կուրս</SelectItem>
                        <SelectItem value="3">3-րդ կուրս</SelectItem>
                        <SelectItem value="4">4-րդ կուրս</SelectItem>
                        <SelectItem value="5">5-րդ կուրս</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="group">Խումբ</Label>
                    <Input
                      id="group"
                      value={newUser.group}
                      onChange={(e) => setNewUser(prev => ({ ...prev, group: e.target.value }))}
                      placeholder="Օրինակ՝ ԿՄ-021"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNewUser(false)}>Չեղարկել</Button>
              <Button onClick={handleCreateUser}>Ստեղծել</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Օգտատերերի ցանկ</CardTitle>
          <CardDescription>Համակարգում գրանցված բոլոր օգտատերերը</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-left">ID</TableHead>
                <TableHead className="text-left">Օգտատեր</TableHead>
                <TableHead className="text-left">Էլ․ հասցե</TableHead>
                <TableHead className="text-left">Դերակատարում</TableHead>
                <TableHead className="text-left">Ֆակուլտետ</TableHead>
                <TableHead className="text-left">Կուրս/Խումբ</TableHead>
                <TableHead className="text-right">Գործողություններ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === 'admin' && 'Ադմինիստրատոր'}
                    {user.role === 'supervisor' && 'Ծրագրի ղեկավար'}
                    {user.role === 'project_manager' && 'Պրոեկտի մենեջեր'}
                    {user.role === 'instructor' && 'Դասախոս'}
                    {user.role === 'lecturer' && 'Դասախոս'}
                    {user.role === 'employer' && 'Գործատու'}
                    {user.role === 'student' && 'Ուսանող'}
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    {user.role === 'student' && user.course && user.group ? 
                      `${user.course}-րդ կուրս, ${user.group}` : 
                      ''}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {user.role === 'student' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" title="Նշանակել ղեկավար">
                              <Users size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ղեկավարի նշանակում</DialogTitle>
                              <DialogDescription>
                                Ընտրեք ղեկավար {user.name} ուսանողի համար։
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Select onValueChange={(value) => handleAssignSupervisor(user.id, value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Ընտրեք ղեկավար" />
                                </SelectTrigger>
                                <SelectContent>
                                  {supervisors.map(supervisor => (
                                    <SelectItem key={supervisor.id} value={supervisor.id}>
                                      {supervisor.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Չեղարկել</Button>
                              <Button>Նշանակել</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Dialog open={openEditUser === user.id} onOpenChange={(open) => {
                        if (open) {
                          handleEditUser(user.id);
                        } else {
                          setOpenEditUser(null);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" title="Խմբագրել">
                            <Pencil size={14} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Խմբագրել օգտատիրոջը</DialogTitle>
                            <DialogDescription>
                              Փոփոխեք {user.name} օգտատիրոջ տվյալները։
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-name">Անուն Ազգանուն</Label>
                              <Input
                                id="edit-name"
                                value={newUser.name}
                                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-email">Էլ․ հասցե</Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-department">Ֆակուլտետ</Label>
                              <Input
                                id="edit-department"
                                value={newUser.department}
                                onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                              />
                            </div>
                            
                            {showStudentFields && (
                              <>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-course">Կուրս</Label>
                                  <Select
                                    value={newUser.course}
                                    onValueChange={(value) => setNewUser(prev => ({ ...prev, course: value }))}
                                  >
                                    <SelectTrigger id="edit-course">
                                      <SelectValue placeholder="Ընտրեք կուրսը" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1-ին կուրս</SelectItem>
                                      <SelectItem value="2">2-րդ կուրս</SelectItem>
                                      <SelectItem value="3">3-րդ կուրս</SelectItem>
                                      <SelectItem value="4">4-րդ կուրս</SelectItem>
                                      <SelectItem value="5">5-րդ կուրս</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-group">Խումբ</Label>
                                  <Input
                                    id="edit-group"
                                    value={newUser.group}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, group: e.target.value }))}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenEditUser(null)}>Չեղարկել</Button>
                            <Button onClick={handleUpdateUser}>Պահպանել</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Ջնջել"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
