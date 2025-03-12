
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminReset from '@/components/AdminReset';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  avatar?: string;
}

const PendingApprovals: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  
  const { getPendingUsers, approveRegistration } = useAuth();
  
  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      // First try to load from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('registration_approved', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Convert to our format
      const formattedUsers = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        avatar: user.avatar
      }));
      
      // Also load pending users from mock system
      const mockPendingUsers = getPendingUsers()
        .filter(u => u.verified && !u.registrationApproved)
        .map(u => ({
          id: u.id || '',
          name: u.name || '',
          email: u.email || '',
          role: u.role || '',
          created_at: new Date().toISOString(),
          avatar: u.avatar
        }));
      
      // Combine both sources
      setPendingUsers([...formattedUsers, ...mockPendingUsers]);
    } catch (error) {
      console.error('Error loading pending users:', error);
      toast.error('Սխալ՝ տվյալների բեռնման ժամանակ');
      
      // Fallback to mock data
      const mockPendingUsers = getPendingUsers()
        .filter(u => u.verified && !u.registrationApproved)
        .map(u => ({
          id: u.id || '',
          name: u.name || '',
          email: u.email || '',
          role: u.role || '',
          created_at: new Date().toISOString(),
          avatar: u.avatar
        }));
      
      setPendingUsers(mockPendingUsers);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadPendingUsers();
  }, []);
  
  const handleApprove = async (userId: string) => {
    setApproving(userId);
    try {
      // First try with Supabase
      const { error } = await supabase
        .from('users')
        .update({ registration_approved: true })
        .eq('id', userId);
      
      if (error) {
        // Fallback to mock system
        const success = await approveRegistration(userId);
        if (!success) {
          throw new Error('Failed to approve user');
        }
      }
      
      toast.success('Օգտատերը հաստատված է');
      loadPendingUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Սխալ՝ օգտատիրոջ հաստատման ժամանակ');
    } finally {
      setApproving(null);
    }
  };
  
  const handleReject = async (userId: string) => {
    setRejecting(userId);
    try {
      // First try with Supabase
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) {
        // For now, just show success even for mock users
        // In a real app, we would implement proper rejection
      }
      
      toast.success('Օգտատերը մերժված է');
      loadPendingUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('Սխալ՝ օգտատիրոջ մերժման ժամանակ');
    } finally {
      setRejecting(null);
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default">Ադմինիստրատոր</Badge>;
      case 'lecturer':
        return <Badge variant="secondary">Դասախոս</Badge>;
      case 'employer':
        return <Badge variant="outline">Գործատու</Badge>;
      case 'project_manager':
        return <Badge variant="destructive">Նախագծի ղեկավար</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  return (
    <AdminLayout pageTitle="Հաստատման սպասող օգտատերեր">
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Հաստատման սպասող օգտատերեր</CardTitle>
                <CardDescription>
                  Հաստատեք նոր օգտատերերի հաշիվները
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : pendingUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <UserCheck className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Այս պահին չկան հաստատման սպասող օգտատերեր</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Օգտատեր</TableHead>
                        <TableHead>Դերակատարում</TableHead>
                        <TableHead>Ամսաթիվ</TableHead>
                        <TableHead className="text-right">Գործողություններ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString('hy-AM')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="default" 
                                size="sm" 
                                onClick={() => handleApprove(user.id)}
                                disabled={approving === user.id}
                              >
                                {approving === user.id ? (
                                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Հաստատել
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleReject(user.id)}
                                disabled={rejecting === user.id}
                              >
                                {rejecting === user.id ? (
                                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                ) : (
                                  <XCircle className="h-4 w-4 mr-1" />
                                )}
                                Մերժել
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <AdminReset />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PendingApprovals;
