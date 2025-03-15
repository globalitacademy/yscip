
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from "@/components/ui/use-toast";
import { MessageSquare, Search, Clipboard } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { loadProjectReservations } from '@/utils/projectUtils';
import { ProjectReservation } from '@/utils/projectUtils'; // Use from projectUtils to match types
import SupervisorProjectManagement from '@/components/supervisor/SupervisorProjectManagement';
import SupervisorRequestsTab from '@/components/supervisor/SupervisorRequestsTab';
import SupervisorRejectDialog from '@/components/supervisor/SupervisorRejectDialog';
import SupervisorEmptyState from '@/components/supervisor/SupervisorEmptyState';

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
  
  // Filter reservations based on search term
  const filteredPendingReservations = pendingReservations.filter(res => 
    (res.projectTitle || `Project #${res.projectId}`).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredApprovedReservations = approvedReservations.filter(res => 
    (res.projectTitle || `Project #${res.projectId}`).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle approval of a reservation
  const handleApprove = (reservation: ProjectReservation) => {
    approveReservation(reservation.id);
    toast({
      title: "Հարցումն ընդունված է",
      description: `Դուք հաստատել եք ${reservation.projectTitle || `Project #${reservation.projectId}`} նախագծի ղեկավարումը։`,
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
      rejectReservation(selectedReservation.id, rejectFeedback);
      setShowRejectDialog(false);
      setRejectFeedback('');
      setSelectedReservation(null);
      toast({
        title: "Հարցումը մերժված է",
        description: "Ուսանողը կստանա ձեր մերժման պատճառը։",
      });
    }
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
          
          <SupervisorRequestsTab 
            pendingReservations={filteredPendingReservations}
            onApprove={handleApprove}
            onReject={handleOpenRejectDialog}
          />
        </TabsContent>
        
        <TabsContent value="supervised" className="mt-0">
          <h2 className="text-xl font-semibold mb-4">Ղեկավարվող նախագծեր</h2>
          
          {filteredApprovedReservations.length === 0 ? (
            <SupervisorEmptyState 
              icon={<Clipboard className="h-12 w-12" />}
              title="Չկան ղեկավարվող նախագծեր"
              description="Դուք դեռ չեք հաստատել որևէ նախագծի ղեկավարում։ Հաստատելուց հետո նախագծերը կհայտնվեն այստեղ։"
            />
          ) : (
            <SupervisorProjectManagement reservations={filteredApprovedReservations} />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Reject Dialog */}
      <SupervisorRejectDialog 
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        selectedReservation={selectedReservation}
        rejectFeedback={rejectFeedback}
        setRejectFeedback={setRejectFeedback}
        onReject={handleReject}
      />
    </AdminLayout>
  );
};

export default SupervisedStudentsPage;
