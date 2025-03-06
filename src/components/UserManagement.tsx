
import React, { useState } from 'react';
import { User, UserRole, mockUsers } from '@/data/userRoles';
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
import { toast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash, UserPlus, Users } from 'lucide-react';

interface UserManagementProps {
  // Props can be added if needed
}

const UserManagement: React.FC<UserManagementProps> = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [openNewUser, setOpenNewUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'student',
    department: 'Ինֆորմատիկայի ֆակուլտետ'
  });

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը",
        variant: "destructive",
      });
      return;
    }

    const id = `user-${Date.now()}`;
    const createdUser: User = {
      id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as UserRole,
      department: newUser.department,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`
    };

    setUsers(prev => [...prev, createdUser]);
    setNewUser({
      name: '',
      email: '',
      role: 'student',
      department: 'Ինֆորմատիկայի ֆակուլտետ'
    });
    setOpenNewUser(false);

    toast({
      title: "Օգտատերը ստեղծված է",
      description: `${createdUser.name} օգտատերը հաջողությամբ ստեղծվել է։`,
    });
  };

  const handleAssignSupervisor = (studentId: string, supervisorId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === supervisorId) {
        return {
          ...user,
          supervisedStudents: [...(user.supervisedStudents || []), studentId]
        };
      }
      return user;
    }));

    toast({
      title: "Ղեկավարը նշանակված է",
      description: "Ուսանողին հաջողությամբ նշանակվել է ղեկավար։",
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    toast({
      title: "Օգտատերը ջնջված է",
      description: "Օգտատերը հաջողությամբ ջնջվել է համակարգից։",
    });
  };

  const supervisors = users.filter(user => user.role === 'supervisor');
  const students = users.filter(user => user.role === 'student');

  return (
    <div className="space-y-8">
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
                    <SelectItem value="instructor">Դասախոս</SelectItem>
                    <SelectItem value="student">Ուսանող</SelectItem>
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
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Օգտատեր</TableHead>
                <TableHead>Էլ․ հասցե</TableHead>
                <TableHead>Դերակատարում</TableHead>
                <TableHead>Ֆակուլտետ</TableHead>
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
                    {user.role === 'instructor' && 'Դասախոս'}
                    {user.role === 'student' && 'Ուսանող'}
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
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
                      <Button variant="outline" size="icon">
                        <Pencil size={14} />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
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
