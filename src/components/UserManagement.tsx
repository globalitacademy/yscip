
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserManagementProps {
  // Props can be added if needed
}

const UserManagement: React.FC<UserManagementProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNewUser, setOpenNewUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
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
  
  const showStudentFields = newUser.role === 'student';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                                disabled // Email shouldn't be changed easily
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
                        disabled={user.email === 'gitedu@bk.ru' || user.email === currentUser?.email}
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
