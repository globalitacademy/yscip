
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Clock, Search, MessageSquare, Clipboard } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { getUsersByRole } from '@/data/userRoles';
import { loadProjectReservations } from '@/utils/projectUtils';
import { ProjectReservation } from '@/types/project';
import SupervisorProjectManagement from '@/components/supervisor/SupervisorProjectManagement';

const SupervisedStudentsPage: React.FC = () => {
  const { user } = useAuth();
  const { approveReservation, rejectReservation } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<ProjectReservation | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');
  
  // Get all project reservations
  const projectReservations = loadProjectReservations();
  
  // Filter reservations for the current supervisor
  const pendingReservations = projectReservations.filter(
    res => res.supervisorId === user?.id && res.status === 'pending'
  );
  
  const approvedReservations = projectReservations.filter(
    res => res.supervisorId === user?.id && res.status === 'approved'
  );
  
  // Get student users for displaying student info
  const students = getUsersByRole('student');
  
  // Filter reservations based on search term
  const filteredPendingReservations = pendingReservations.filter(res => 
    res.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    students.find(s => s.id === res.userId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredApprovedReservations = approvedReservations.filter(res => 
    res.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    students.find(s => s.id === res.userId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle approval of a reservation
  const handleApprove = (reservation: ProjectReservation) => {
    approveReservation(reservation.projectId);
    toast({
      title: "Հարցումն ընդունված է",
      description: `Դուք հաստատել եք ${reservation.projectTitle} նախագծի ղեկավարումը։`,
    });
  };
  
  // Open reject dialog
  const handleOpenRejectDialog = (reservation: ProjectReservation) => {
    setSelectedReservation(reservation);
    setShowRejectDialog(true);
  };
  
  // Handle rejection of a reservation
  const handleReject = () => {
    if (selectedReservation && rejectFeedback) {
      rejectReservation(selectedReservation.projectId, rejectFeedback);
      setShowRejectDialog(false);
      setRejectFeedback('');
      setSelectedReservation(null);
      toast({
        title: "Հարցումը մերժված է",
        description: "Ուսանողը կստանա ձեր մերժման պատճառը։",
      });
    }
  };
  
  // Get student info by ID
  const getStudentInfo = (studentId: string) => {
    return students.find(student => student.id === studentId);
  };
  
  // Render reservation card
  const renderReservationCard = (reservation: ProjectReservation) => {
    const student = getStudentInfo(reservation.userId);
    
    return (
      <Card key={`${reservation.projectId}-${reservation.userId}`} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{reservation.projectTitle}</CardTitle>
              <CardDescription>
                Հարցում ուղարկվել է {new Date(reservation.timestamp).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={
                reservation.status === 'pending'
                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                  : reservation.status === 'approved'
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-red-100 text-red-700 border-red-200'
              }
            >
              {reservation.status === 'pending' && (
                <><Clock className="h-3 w-3 mr-1" /> Սպասում է</>
              )}
              {reservation.status === 'approved' && (
                <><CheckCircle className="h-3 w-3 mr-1" /> Հաստատված</>
              )}
              {reservation.status === 'rejected' && (
                <><XCircle className="h-3 w-3 mr-1" /> Մերժված</>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={student?.avatar} alt={student?.name} />
              <AvatarFallback>{student?.name?.substring(0, 2) || 'ՈՒ'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{student?.name || 'Անհայտ ուսանող'}</p>
              <p className="text-sm text-muted-foreground">{student?.group || 'Անհայտ խումբ'}</p>
            </div>
          </div>
          
          {reservation.status === 'pending' && (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => handleOpenRejectDialog(reservation)}
              >
                <XCircle className="h-4 w-4 mr-1" /> Մերժել
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleApprove(reservation)}
              >
                <CheckCircle className="h-4 w-4 mr-1" /> Հաստատել
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // If user is not a supervisor, show error message
  if (!user || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
    return (
      <AdminLayout pageTitle="Ուսանողների ղեկավարում">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-2">Մուտքն արգելված է</h2>
          <p className="text-muted-foreground">
            Այս էջը հասանելի է միայն նախագծերի ղեկավարների համար։
          </p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout pageTitle="Ուսանողների ղեկավարում">
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <MessageSquare size={16} /> Հարցումներ 
            {pendingReservations.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingReservations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="supervised" className="flex items-center gap-2">
            <Clipboard size={16} /> Ղեկավարվող նախագծեր
            {approvedReservations.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {approvedReservations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Փնտրել ըստ նախագծի կամ ուսանողի..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <TabsContent value="requests" className="mt-0">
          <h2 className="text-xl font-semibold mb-4">Սպասող հարցումներ</h2>
          
          {filteredPendingReservations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Չկան սպասող հարցումներ</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Այս պահին չկան սպասող հարցումներ։ Երբ ուսանողները ընտրեն ձեզ որպես իրենց նախագծի ղեկավար, դուք կստանաք ծանուցում։
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {filteredPendingReservations.map(renderReservationCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="supervised" className="mt-0">
          <h2 className="text-xl font-semibold mb-4">Ղեկավարվող նախագծեր</h2>
          
          {filteredApprovedReservations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clipboard className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Չկան ղեկավարվող նախագծեր</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Դուք դեռ չեք հաստատել որևէ նախագծի ղեկավարում։ Հաստատելուց հետո նախագծերը կհայտնվեն այստեղ։
                </p>
              </CardContent>
            </Card>
          ) : (
            <SupervisorProjectManagement reservations={filteredApprovedReservations} />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Մերժել հարցումը</DialogTitle>
            <DialogDescription>
              Գրեք մերժման պատճառը, որը կտեսնի ուսանողը։
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Մերժման պատճառը..."
            value={rejectFeedback}
            onChange={(e) => setRejectFeedback(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Չեղարկել
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectFeedback}
            >
              Մերժել հարցումը
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default SupervisedStudentsPage;
