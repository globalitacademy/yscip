import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getPendingApprovals, approveUserAccount, rejectUserAccount } from '@/services/accountService';
import { DBUser } from '@/types/database.types';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';

const PendingApprovals: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<DBUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchPendingApprovals = async () => {
    setLoading(true);
    try {
      const data = await getPendingApprovals();
      setPendingUsers(data as DBUser[]);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      toast.error('Սխալ հաստատման սպասող հաշիվների ստացման ժամանակ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleApprove = async (userId: string) => {
    const success = await approveUserAccount(userId);
    if (success) {
      // Remove the approved user from the list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleReject = async () => {
    if (!selectedUserId || !rejectionReason) {
      toast.error('Խնդրում ենք նշել մերժման պատճառը');
      return;
    }

    const success = await rejectUserAccount(selectedUserId, rejectionReason);
    if (success) {
      setOpenRejectDialog(false);
      setRejectionReason('');
      setSelectedUserId(null);
      // Keep the user in the list but update their status
      fetchPendingApprovals();
    }
  };

  const openRejectDialogFor = (userId: string) => {
    setSelectedUserId(userId);
    setOpenRejectDialog(true);
  };

  const getRoleTranslation = (role: string) => {
    switch (role) {
      case 'admin': return 'Ադմինիստրատոր';
      case 'lecturer': return 'Դասախոս';
      case 'instructor': return 'Դասախոս';
      case 'project_manager': return 'Պրոյեկտի ղեկավար';
      case 'supervisor': return 'Ղեկավար';
      case 'employer': return 'Գործատու';
      case 'student': return 'Ուսանող';
      default: return role;
    }
  };

  return (
    <AdminLayout pageTitle="Հաստատման սպասող հաշիվներ">
      <Card>
        <CardHeader>
          <CardTitle>Հաստատման սպասող հաշիվներ</CardTitle>
          <CardDescription>
            Օգտատերեր, որոնց հաշիվները սպասում են ադմինիստրատորի հաստատմանը
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center p-8 bg-muted rounded-lg">
              <p className="text-muted-foreground">Հաստատման սպասող հաշիվներ չկան</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Օգտատեր</TableHead>
                  <TableHead>Էլ․ հասցե</TableHead>
                  <TableHead>Դերակատարում</TableHead>
                  <TableHead>Ստեղծվել է</TableHead>
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
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {getRoleTranslation(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('hy-AM')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(user.id)}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Հաստատել
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => openRejectDialogFor(user.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
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

      <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Մերժման պատճառ</DialogTitle>
            <DialogDescription>
              Նշեք, թե ինչու եք մերժում օգտատիրոջ հաշվի հաստատումը: Այս տեղեկատվությունը կուղարկվի օգտատիրոջը:
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rejection-reason">Մերժման պատճառ</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Օրինակ՝ Տվյալները չեն համապատասխանում իրականությանը..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRejectDialog(false)}>
              Չեղարկել
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Մերժել հաշիվը
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PendingApprovals;
