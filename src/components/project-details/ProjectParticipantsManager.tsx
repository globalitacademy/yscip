
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Trash2, Save, X, Search, UserCheck, UserX } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getUsersByRole } from '@/data/userRoles';

interface ProjectParticipant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status?: 'active' | 'pending' | 'rejected';
}

interface ProjectParticipantsManagerProps {
  projectMembers: ProjectParticipant[];
  onUpdateMembers: (members: ProjectParticipant[]) => Promise<boolean>;
}

const ProjectParticipantsManager: React.FC<ProjectParticipantsManagerProps> = ({
  projectMembers,
  onUpdateMembers
}) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedMembers, setEditedMembers] = useState<ProjectParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get available students and supervisors from mock data
  const availableStudents = getUsersByRole('student');
  const availableSupervisors = [...getUsersByRole('supervisor'), ...getUsersByRole('project_manager')];
  const [selectedRole, setSelectedRole] = useState<'student' | 'supervisor'>('student');
  
  const filteredUsers = (selectedRole === 'student' ? availableStudents : availableSupervisors)
    .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleOpenDialog = () => {
    setEditedMembers([...projectMembers]);
    setIsDialogOpen(true);
    setSearchQuery('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const success = await onUpdateMembers(editedMembers);
      if (success) {
        toast.success('Մասնակիցների ցանկը հաջողությամբ թարմացվել է');
        setIsDialogOpen(false);
      } else {
        toast.error('Մասնակիցների ցանկի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (error) {
      console.error('Error updating members:', error);
      toast.error('Մասնակիցների ցանկի թարմացման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = (newMember: { id: string; name: string; avatar: string }) => {
    // Check if member already exists
    if (editedMembers.some(m => m.id === newMember.id)) {
      toast.info('Այս մասնակիցն արդեն ավելացված է');
      return;
    }
    
    // Add new member with selected role
    setEditedMembers([
      ...editedMembers,
      {
        ...newMember,
        role: selectedRole,
        status: 'pending'
      }
    ]);
    
    toast.success(`${newMember.name}ն ավելացվել է որպես ${selectedRole === 'student' ? 'ուսանող' : 'ղեկավար'}`);
  };

  const removeMember = (memberId: string) => {
    setEditedMembers(editedMembers.filter(member => member.id !== memberId));
  };

  const updateMemberStatus = (memberId: string, status: 'active' | 'pending' | 'rejected') => {
    setEditedMembers(editedMembers.map(member => 
      member.id === memberId ? { ...member, status } : member
    ));
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'lecturer' || user?.role === 'project_manager';

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Button 
        onClick={handleOpenDialog} 
        variant="outline"
        className="mt-4 w-full flex items-center justify-center gap-2"
      >
        <UserPlus size={16} />
        Կառավարել մասնակիցներին
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Նախագծի մասնակիցների կառավարում</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current participants */}
            <div>
              <h3 className="text-lg font-medium mb-3">Ներկայիս մասնակիցներ</h3>
              {editedMembers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Անուն</TableHead>
                      <TableHead>Դեր</TableHead>
                      <TableHead>Կարգավիճակ</TableHead>
                      <TableHead className="w-[100px]">Գործողություններ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editedMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {member.role === 'student' ? 'Ուսանող' : 'Ղեկավար'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={member.status || 'pending'} 
                            onValueChange={(value) => updateMemberStatus(member.id, value as any)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">Սպասում է</Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="active">
                                <div className="flex items-center gap-2">
                                  <Badge variant="default" className="text-xs">Ակտիվ</Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="rejected">
                                <div className="flex items-center gap-2">
                                  <Badge variant="destructive" className="text-xs">Մերժված</Badge>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:bg-destructive/10 text-destructive"
                            onClick={() => removeMember(member.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Մասնակիցներ չկան ավելացված
                </div>
              )}
            </div>

            {/* Add new participants */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Ավելացնել նոր մասնակից</h3>
              
              <div className="flex gap-4 mb-4">
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Ուսանող</SelectItem>
                    <SelectItem value="supervisor">Ղեկավար</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Փնտրել ըստ անունի"
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="border rounded-md h-[200px] overflow-auto">
                {filteredUsers.length > 0 ? (
                  <div className="divide-y">
                    {filteredUsers.map(user => (
                      <div 
                        key={user.id}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="hover:bg-primary/10 text-primary"
                          onClick={() => addMember({ 
                            id: user.id, 
                            name: user.name, 
                            avatar: user.avatar || ''
                          })}
                        >
                          <UserPlus size={16} className="mr-1" />
                          Ավելացնել
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Ոչ մի մասնակից չի գտնվել
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X size={16} className="mr-2" /> Չեղարկել
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Պահպանվում է...' : (
                <><Save size={16} className="mr-2" /> Պահպանել մասնակիցները</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectParticipantsManager;
