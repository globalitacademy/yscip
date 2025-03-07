
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
  organization?: string;
  verificationStatus: 'verified' | 'pending';
  registrationDate: string;
}

const PendingApprovals: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([
    {
      id: 'pending-1',
      name: 'Դավիթ Մովսիսյան',
      email: 'davit@example.com',
      role: 'lecturer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=davit',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      verificationStatus: 'verified',
      registrationDate: '2023-06-15'
    },
    {
      id: 'pending-2',
      name: 'Սոնա Ասատրյան',
      email: 'sona@example.com',
      role: 'project_manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sona',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      verificationStatus: 'verified',
      registrationDate: '2023-06-17'
    },
    {
      id: 'pending-3',
      name: 'Արթուր Մելքոնյան',
      email: 'artur@example.com',
      role: 'employer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artur',
      organization: 'Տեխնոլոջի Գրուպ',
      verificationStatus: 'verified',
      registrationDate: '2023-06-18'
    },
    {
      id: 'pending-4',
      name: 'Նարինե Հովհաննիսյան',
      email: 'narine@example.com',
      role: 'supervisor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=narine',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      verificationStatus: 'pending',
      registrationDate: '2023-06-20'
    }
  ]);
  
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const handleApprove = (userId: string) => {
    // In a real application, this would make an API call
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    toast.success("Օգտատիրոջ գրանցումը հաստատվեց");
  };
  
  const handleReject = (userId: string) => {
    // In a real application, this would make an API call
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    toast.success("Օգտատիրոջ գրանցումը մերժվեց");
  };
  
  const handleViewDetails = (user: PendingUser) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };
  
  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Ադմինիստրատոր';
      case 'lecturer': return 'Դասախոս';
      case 'instructor': return 'Դասախոս';
      case 'supervisor': return 'Ծրագրի ղեկավար';
      case 'project_manager': return 'Պրոեկտի մենեջեր';
      case 'employer': return 'Գործատու';
      case 'student': return 'Ուսանող';
      default: return role;
    }
  };
  
  return (
    <AdminLayout pageTitle="Հաստատման սպասող օգտատերեր">
      <Card>
        <CardHeader>
          <CardTitle>Հաստատման սպասող օգտատերեր</CardTitle>
          <CardDescription>
            Ստորև ներկայացված են վերիֆիկացված օգտատերերը, որոնք սպասում են ադմինիստրատորի հաստատման
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Հաստատման սպասող օգտատերեր չեն գտնվել
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-left">ID</TableHead>
                  <TableHead className="text-left">Օգտատեր</TableHead>
                  <TableHead className="text-left">Դերակատարում</TableHead>
                  <TableHead className="text-left">էլ․ հասցե</TableHead>
                  <TableHead className="text-left">Վերիֆիկացիա</TableHead>
                  <TableHead className="text-left">Գրանցման ամսաթիվ</TableHead>
                  <TableHead className="text-right">Գործողություններ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user, index) => (
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
                    <TableCell>{getRoleName(user.role)}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.verificationStatus === 'verified' ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Վերիֆիկացված</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Սպասման մեջ</Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.registrationDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewDetails(user)}
                          title="Դիտել մանրամասները"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApprove(user.id)}
                          title="Հաստատել"
                        >
                          <CheckCircle size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(user.id)}
                          title="Մերժել"
                        >
                          <XCircle size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {/* User Details Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Օգտատիրոջ մանրամասներ</DialogTitle>
                <DialogDescription>
                  Օգտատիրոջ գրանցման հայտի մանրամասները
                </DialogDescription>
              </DialogHeader>
              
              {selectedUser && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback>{selectedUser.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{selectedUser.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Դերակատարում</div>
                      <div>{getRoleName(selectedUser.role)}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Վերիֆիկացիա</div>
                      <div>
                        {selectedUser.verificationStatus === 'verified' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Վերիֆիկացված</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Սպասման մեջ</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Գրանցման ամսաթիվ</div>
                      <div>{selectedUser.registrationDate}</div>
                    </div>
                    
                    {selectedUser.department && (
                      <div>
                        <div className="text-sm font-medium mb-1">Ֆակուլտետ</div>
                        <div>{selectedUser.department}</div>
                      </div>
                    )}
                    
                    {selectedUser.organization && (
                      <div>
                        <div className="text-sm font-medium mb-1">Կազմակերպություն</div>
                        <div>{selectedUser.organization}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <DialogFooter className="sm:justify-between">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Փակել
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      if (selectedUser) {
                        handleReject(selectedUser.id);
                        setViewDialogOpen(false);
                      }
                    }}
                  >
                    Մերժել
                  </Button>
                  <Button 
                    onClick={() => {
                      if (selectedUser) {
                        handleApprove(selectedUser.id);
                        setViewDialogOpen(false);
                      }
                    }}
                  >
                    Հաստատել
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default PendingApprovals;
