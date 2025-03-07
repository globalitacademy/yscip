
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PendingUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  organization?: string;
  department?: string;
  avatar?: string;
}

const PendingApprovals: React.FC = () => {
  const { user, approveRegistration } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Ստուգել արդյոք ընթացիկ օգտատերը ադմին է
        if (!user || user.role !== 'admin') {
          setError('Միայն ադմինիստրատորը կարող է դիտել այս էջը:');
          setIsLoading(false);
          return;
        }
        
        // Ստանալ բոլոր օգտատերերին Supabase-ից
        const { data, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
          console.error('Error fetching users:', error);
          setError('Տեղի ունեցավ սխալ օգտատերերի ցուցակը ստանալիս:');
          setIsLoading(false);
          return;
        }
        
        // Ֆիլտրել հաստատման սպասող օգտատերերին
        // (ով էլ․ հասցեն հաստատված է, բայց գրանցումը՝ ոչ)
        const pending = data.users
          .filter(u => 
            u.email_confirmed_at !== null && 
            u.user_metadata?.role && 
            u.user_metadata.role !== 'student' && 
            !u.user_metadata.registration_approved
          )
          .map(u => ({
            id: u.id,
            email: u.email || '',
            name: u.user_metadata?.name || 'Անանուն',
            role: u.user_metadata?.role || '',
            created_at: u.created_at,
            organization: u.user_metadata?.organization,
            department: u.user_metadata?.department,
            avatar: u.user_metadata?.avatar
          }));
        
        setPendingUsers(pending);
      } catch (error: any) {
        console.error('Error fetching pending users:', error);
        setError(error.message || 'Տեղի ունեցավ անսպասելի սխալ։');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPendingUsers();
  }, [user]);
  
  const handleApprove = async (userId: string) => {
    try {
      // Կատարել API հարցում հաստատման համար
      const success = await approveRegistration(userId);
      
      if (success) {
        // Թարմացնել օգտատերերի ցուցակը
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
        toast.success("Օգտատիրոջ գրանցումը հաստատվեց");
      } else {
        toast.error("Տեղի ունեցավ սխալ: Փորձեք կրկին");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Տեղի ունեցավ սխալ: Փորձեք կրկին");
    }
  };
  
  const handleReject = async (userId: string) => {
    try {
      // Supabase-ում օգտատիրոջը հեռացնելու հարցում
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        console.error('Error deleting user:', error);
        toast.error("Տեղի ունեցավ սխալ օգտատիրոջը հեռացնելիս: Փորձեք կրկին");
        return;
      }
      
      // Թարմացնել օգտատերերի ցուցակը
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      toast.success("Օգտատիրոջ գրանցումը մերժվեց");
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Տեղի ունեցավ սխալ: Փորձեք կրկին");
    }
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
  
  const formatDate = (timestamp: string) => {
    if (!timestamp) return 'Անհայտ';
    const date = new Date(timestamp);
    return date.toLocaleDateString('hy-AM');
  };
  
  if (isLoading) {
    return (
      <AdminLayout pageTitle="Հաստատման սպասող օգտատերեր">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout pageTitle="Հաստատման սպասող օգտատերեր">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
              <h3 className="text-lg font-medium mb-2">Սխալ</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }
  
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
                          <AvatarFallback>{user.name?.substring(0, 2) || "??"}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleName(user.role)}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
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
                      <AvatarFallback>{selectedUser.name?.substring(0, 2) || "??"}</AvatarFallback>
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
                      <div className="text-sm font-medium mb-1">Գրանցման ամսաթիվ</div>
                      <div>{formatDate(selectedUser.created_at)}</div>
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
